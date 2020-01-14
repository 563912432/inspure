<template>
  <div class="shenBao">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
      </span>
      <span>
        <el-button size="small" type="primary" @click="createCompany">创建{{ tabPosition === 1?'国税': '个税' }}企业</el-button>
        <el-button size="small" type="primary" @click="toSystem">进入{{ tabPosition === 1?'国税': '个税' }}系统</el-button>
      </span>
    </div>
    <div class="mb-12">
      <div class="tab-parent flex mb-12">
        <div class="tab-item" :class="tabPosition === 1?'active': ''" @click="choseTab(1)">
          国税
        </div>
        <div class="tab-item" :class="tabPosition === 2?'active': ''" @click="choseTab(2)">
          个税
        </div>
      </div>
    </div>
    <div class="">
      <div v-show="tabPosition === 1">
        <div class="mb-12">
          <!--eslint-disable-next-line-->
          <el-checkbox v-model="resultGuoShuiData[month]['state']" :true-label="1" :false-label="0">启用国税系统</el-checkbox>
        </div>
        <div class="box-shadow p-10">
          <div class="tab-parent flex mb-12">
            <div class="tab-item" :class="guoShuiTabPosition === 1?'active': ''" @click="choseGuoShuiTab(1)">
              操作说明
            </div>
            <div class="tab-item" :class="guoShuiTabPosition === 2?'active': ''" @click="choseGuoShuiTab(2)">
              印花税申报表设置
            </div>
            <div class="tab-item" :class="guoShuiTabPosition === 3?'active': ''" @click="choseGuoShuiTab(3)">
              增值税申报表设置
            </div>
            <div class="tab-item" :class="guoShuiTabPosition === 4?'active': ''" @click="choseGuoShuiTab(4)">
              财务报表设置
            </div>
          </div>
          <div v-show="guoShuiTabPosition === 1">
            <div class="line-height-25">1、进入系统之前，请先创建企业 </div>
            <div class="line-height-25">2、每个月份对应单独的企业，如有多个月份，请维护每个月份的企业信息</div>
            <div class="line-height-25">3、系统默认的纳税人识别号为当前账套的纳税人识别号，密码是123456</div>
            <div class="line-height-25">3、印花税申报</div>
            <div class="line-height-25">4、企业所得税季度申报</div>
            <div class="line-height-25">5、企业所得税年报</div>
            <div class="line-height-25">6、增值税及附加费申报</div>
            <div class="line-height-25">7、财务报表报送</div>
          </div>
          <div v-if="guoShuiTabPosition === 2">
            <GuoShuiInHua :guo-shui-yin-hua="guoShuiYinHua" />
          </div>
          <div v-if="guoShuiTabPosition === 3">
            <GuoShuiZengZhi :guo-shui-zeng-zhi="guoShuiZengZhi" />
          </div>
          <div v-if="guoShuiTabPosition === 4">
            <GuoShuiCaiWu :guo-shui-cai-wu="guoShuiCaiWu" />
          </div>
        </div>
      </div>
      <div v-show="tabPosition === 2">
        <div class="mb-12">
          <!--eslint-disable-next-line-->
          <el-checkbox v-model="resultGeShuiData[month]['state']" :true-label="1" :false-label="0">启用个税系统</el-checkbox>
        </div>
        <!--企业基本信息设置-->
        <div class="box-shadow p-10">
          <div class="line-height-25">1、进入系统之前，请先创建企业 </div>
          <div class="line-height-25">2、每个月份对应单独的企业，如有多个月份，请维护每个月份的企业信息</div>
          <div class="line-height-25">3、默认申报密码：000000</div>
          <div class="line-height-25">4、采集人员信息</div>
          <div class="line-height-25">5、填写专项附加扣除信息：000000</div>
          <div class="line-height-25">6、综合所得申报</div>
          <div class="line-height-25">7、缴款</div>
        </div>
      </div>
      <div class="mt-10">
        <el-button type="primary" size="small" @click="back">
          上一步
        </el-button>
        <el-button type="primary" size="small" @click="next">
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import Cookie from 'js-cookie'
import { createGeShuiCompany, delGeShuiCompany, createGuoShuiCompany, delGuoShuiCompany } from '@/api/accountKu'
import { getNextMonth } from '@/utils/index'
import elDragDialog from '@/directive/el-drag-dialog'
import GuoShuiInHua from './guoShuiYinHua'
import GuoShuiZengZhi from './guoShuiZengZhi'
import GuoShuiCaiWu from './guoShuiCaiWu' // base on element-ui
export default {
  name: 'ShenBao',
  components: { GuoShuiCaiWu, GuoShuiZengZhi, GuoShuiInHua },
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      month: '',
      resultGeShuiData: {},
      resultGuoShuiData: {},
      tabPosition: 1,
      guoShuiYinHua: [],
      guoShuiZengZhi: [],
      guoShuiCaiWu: [],
      rules: {
        shenbao_month: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        default_password: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }]
      },
      guoShuiTabPosition: 1,
      guoShuiCompanyId: {},
      geShuiCompanyId: {},
      guoShuiStatus: false,
      geShuiStatus: false
    }
  },
  computed: {
    accountAnswer() {
      return this.$store.getters.accountAnswer
    },
    currentAccountData() {
      return this.$store.state.account.currentAccountData
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
        this.accountAnswer.accountData.forEach(v => {
          this.monthData.push(v.month)
          if (this.accountAnswer['ge_shui'][v.month]) {
            this.$set(this.resultGeShuiData, v.month, this.accountAnswer['ge_shui'][v.month])
          } else {
            this.$set(this.resultGeShuiData, v.month, { company_id: '', account_id: '', state: 0, score: '' })
          }
          if (this.accountAnswer['guo_shui'][v.month]) {
            this.$set(this.resultGuoShuiData, v.month, this.accountAnswer['guo_shui'][v.month])
          } else {
            this.$set(this.resultGuoShuiData, v.month, { company_id: '', account_id: '', state: 0, score: '', config: this.guoShuiBaseData() })
          }
        })
        this.month = this.monthData[0] // 第一个月份
        this.guoShuiYinHua = this.resultGuoShuiData[this.month]['config']['yin_hua_shui']
        this.guoShuiZengZhi = this.resultGuoShuiData[this.month]['config']['zeng_zhi_shui']
        this.guoShuiCaiWu = this.resultGuoShuiData[this.month]['config']['cai_wu']
      } else {
        this.$message.warning('请先维护月份')
      }
    },
    choseMonth() {
      this.guoShuiYinHua = this.resultGuoShuiData[this.month]['config']['yin_hua_shui']
      this.guoShuiZengZhi = this.resultGuoShuiData[this.month]['config']['zeng_zhi_shui']
      this.guoShuiCaiWu = this.resultGuoShuiData[this.month]['config']['cai_wu']
      this.tabPosition = 1
      this.guoShuiTabPosition = 1
    },
    choseTab(index) {
      this.tabPosition = index
    },
    choseGuoShuiTab(index) {
      this.guoShuiTabPosition = index
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
    },
    createCompany() {
      if (this.tabPosition === 1) {
        // 创建国税企业
        /*  公司名称 this.currentAccountData.company
        税号 this.currentAccountData.tax_no
        开户行账号 this.currentAccountData.account_id
        开户行名称 this.currentAccountData.account_name
        开户行地址 this.currentAccountData.account_address
        行业 this.currentAccountData.industry_id
      * */
        const data = {
          firm_name: this.currentAccountData.company,
          firm_code: this.currentAccountData.tax_no,
          firm_trade: this.currentAccountData.industry_id,
          firm_detail_trade: this.currentAccountData.industry_id,
          firm_registration_trade: this.currentAccountData.industry_id,
          firm_address: this.currentAccountData.account_address,
          firm_operating: this.currentAccountData.account_address,
          firm_bank_code: this.currentAccountData.account_id,
          firm_type: '有限责任公司',
          firm_telephone: '03279189',
          telephone_name: '财务负责人',
          taxation_name: '办税人',
          preset: JSON.stringify(this.resultGuoShuiData[this.month]['config'])
        }
        const monthNumber = this.month.substring(0, 4) + this.month.substring(5, 7)
        data.account_id = this.currentAccountData.id + monthNumber
        data.org_id = 0
        createGuoShuiCompany(data).then(response => {
          this.$message.success('创建成功')
          this.guoShuiCompanyId[this.month] = response.data
          this.resultGuoShuiData[this.month]['company_id'] = this.guoShuiCompanyId[this.month]
          this.resultGuoShuiData[this.month]['account_id'] = this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7)
        }).catch()
      } else {
        //  创建个税企业
        const data = {
          trade_name: this.currentAccountData.company,
          firm_code: this.currentAccountData.tax_no,
          shenbao_month: this.month,
          income_start_time: this.month + '-01',
          income_end_time: this.month + '-30',
          shenbao_time: getNextMonth(this.month + '-15'),
          jiaokuan_end_time: getNextMonth(this.month + '-30'),
          jiaokuan_time: getNextMonth(this.month + '-07'),
          youxiao_start_time: getNextMonth(this.month + '-01'),
          youxiao_end_time: getNextMonth(this.month + '-30'),
          default_password: '000000',
          address: this.currentAccountData.account_address
        }
        const monthNumber = this.month.substring(0, 4) + this.month.substring(5, 7)
        data.account_id = this.currentAccountData.id + monthNumber
        data.org_id = 0
        createGeShuiCompany(data).then(response => {
          this.$message.success('创建成功')
          this.geShuiCompanyId[this.month] = response.data
          this.resultGeShuiData[this.month]['company_id'] = this.geShuiCompanyId[this.month]
          this.resultGeShuiData[this.month]['account_id'] = this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7)
        }).catch()
      }
    },
    toSystem() {
      if (this.tabPosition === 1) {
        // 进入国税企业
        if (this.guoShuiCompanyId[this.month] === '' || this.resultGuoShuiData[this.month]['account_id'] === '') {
          this.$message.error('请先创建企业')
        } else {
          // Cookie.set('params', JSON.stringify({ account_id: this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7) }))
          window.open(`${window.domain}guo_shui/#/account/${this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7)}`)
        }
      } else {
        // 进入个税企业
        if (this.geShuiCompanyId[this.month] === '' || this.resultGeShuiData[this.month]['account_id'] === '') {
          this.$message.error('请先创建企业')
        } else {
          // Cookie.set('params', JSON.stringify({ account_id: this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7) }))
          window.open(`${window.domain}geshui/#/login/account/${this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7)}`)
        }
      }
    },
    back() {
      this.$emit('back')
    },
    next() {
      // 国税
      this.guoShuiStatus = false
      for (const i in this.resultGuoShuiData) {
        if (!this.resultGuoShuiData[i].state) {
          // 没启用
          if (this.resultGuoShuiData[i].company_id !== '') {
            // 存在 删除
            delGuoShuiCompany(this.resultGuoShuiData[i].company_id).then(response => {
              console.log('删除成功')
              this.$set(this.resultGuoShuiData[i], 'company_id', '')
              this.guoShuiStatus = true
            }).catch()
          } else {
            this.guoShuiStatus = true
          }
        } else {
          // 启用了 有没有创建企业
          if (this.resultGuoShuiData[i].company_id === '') {
            this.$set(this.resultGuoShuiData[i], 'state', 0)
          }
          this.guoShuiStatus = true
        }
      }
      if (this.guoShuiStatus) {
        this.$store.commit('account/SAVE_GUO_SHUI', this.resultGuoShuiData)
      }
      // 个税
      this.geShuiStatus = false
      for (const i in this.resultGeShuiData) {
        if (!this.resultGeShuiData[i].state) {
          // 没启用
          if (this.resultGeShuiData[i].company_id !== '') {
            // 存在 删除
            delGeShuiCompany(this.resultGeShuiData[i].company_id).then(response => {
              console.log('删除成功')
              this.$set(this.resultGeShuiData[i], 'company_id', '')
              this.geShuiStatus = true
            }).catch()
          } else {
            this.geShuiStatus = true
          }
        } else {
          // 启用了 有没有创建企业
          if (this.resultGeShuiData[i].company_id === '') {
            this.$set(this.resultGeShuiData[i], 'state', 0)
          }
          this.geShuiStatus = true
        }
      }
      if (this.geShuiStatus) {
        this.$store.commit('account/SAVE_GE_SHUI', this.resultGeShuiData)
      }
      this.$emit('next')
    },
    guoShuiBaseData() {
      return {
        yin_hua_shui: [],
        zeng_zhi_shui: [
          { title: '附列材料(三)', info: { firm_name: '', '1_2': '10.00', '2_2': '0.00', '3_2': '0.00', '4_2': '0.00', '5_2': '0.00', '6_2': '0.00', '7_2': '0.00', '8_2': '0.00' }},
          { title: '附列材料(四)', info: { firm_name: '', '1_1': '0.00', '2_1': '0.00', '3_1': '0.00', '4_1': '0.00', '5_1': '0.00' }},
          { title: '增值税纳税申报表(适用于增值税一般纳税人)', info: { firm_code: '', firm_trade: '', firm_name: '', firm_legal_person: '', firm_address: '', firm_operating: '', firm_bank_code: '', firm_type: '', firm_telephone: '', '1_2': '0.00', '2_2': '0.00', '3_2': '0.00', '4_2': '0.00', '5_2': '0.00', '6_2': '0.00', '7_2': '0.00', '8_2': '0.00', '9_2': '0.00', '10_2': '0.00',
            '11_2': '0.00', '12_2': '0.00', '13_2': '0.00', '14_2': '0.00', '15_2': '0.00', '16_2': '0.00', '18_2': '0.00', '19_2': '0.00', '20_2': '0.00', '21_2': '0.00', '22_2': '0.00', '23_2': '0.00', '24_2': '0.00',
            '25_1': '0.00', '25_2': '0.00', '25_3': '0.00', '25_4': '0.00', '26_2': '0.00', '27_2': '0.00', '30_2': '0.00', '31_2': '0.00', '32_1': '0.00', '32_2': '0.00', '36_2': '0.00', '37_2': '0.00', '38_2': '0.00' }}
        ],
        cai_wu: [
          { title: '资产负债表', info: { firm_name: '', '1_2': '0.00', '1_4': '0.00', '2_2': '0.00', '2_4': '0.00', '3_2': '0.00', '3_4': '0.00', '4_2': '0.00', '4_4': '0.00', '5_2': '0.00', '5_4': '0.00', '6_2': '0.00', '6_4': '0.00',
            '7_2': '0.00', '7_4': '0.00', '8_2': '0.00', '8_4': '0.00', '9_2': '0.00', '9_4': '0.00', '10_2': '0.00', '10_4': '0.00', '11_2': '0.00', '11_4': '0.00', '12_2': '0.00', '13_2': '0.00', '13_4': '0.00', '14_2': '0.00', '14_4': '0.00', '15_2': '0.00', '15_4': '0.00',
            '16_4': '0.00', '17_2': '0.00', '17_4': '0.00', '18_2': '0.00', '18_4': '0.00', '19_2': '0.00', '20_2': '0.00', '21_2': '0.00', '22_2': '0.00', '23_2': '0.00', '24_2': '0.00', '25_2': '0.00', '26_2': '0.00', '26_4': '0.00', '27_2': '0.00', '27_4': '0.00',
            '28_2': '0.00', '28_4': '0.00', '29_2': '0.00', '29_4': '0.00', '30_2': '0.00', '30_4': '0.00', '31_2': '0.00', '31_4': '0.00'
          }},
          { title: '利润表', info: { firm_name: '', '1_1': '0.00', '2_1': '0.00', '3_1': '0.00', '4_1': '0.00', '5_1': '0.00', '6_1': '0.00',
            '7_1': '0.00', '8_1': '0.00', '9_1': '0.00', '10_1': '0.00', '11_1': '0.00', '12_1': '0.00', '13_1': '0.00', '14_1': '0.00', '15_1': '0.00',
            '16_1': '0.00', '17_1': '0.00', '18_1': '0.00', '19_1': '0.00', '20_1': '0.00', '21_1': '0.00', '22_1': '0.00', '23_1': '0.00', '24_1': '0.00', '25_1': '0.00', '26_1': '0.00', '27_1': '0.00',
            '28_1': '0.00', '29_1': '0.00', '30_1': '0.00', '31_1': '0.00', '32_1': '0.00'
          }}
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .shenBao {
    padding: 10px 0 10px 10px;
    font-size: 13px;
    .tab-parent{
      height: 30px;
      line-height: 30px;
      border-left: solid 1px #DCDFE6;
      border-right: none;
      .tab-item{
        width: 120px;
        text-align: center;
        border-top: solid 1px #DCDFE6;
        border-right: solid 1px #DCDFE6;
        border-bottom: solid 1px #DCDFE6;
        cursor: pointer;
      }
      .tab-item.active{
        color: #93c343;
        border-bottom: solid 2px #93c343;
      }
      .cate-more-active{
        color: #93c343;
      }
      .cate-more{
        color: #333333;
      }
    }
  }
</style>
