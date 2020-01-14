<template>
  <div class="kaiPiao">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
      </span>
      <span>
        <el-button size="small" type="primary" @click="createCompany">创建企业</el-button>
        <el-button size="small" type="primary" @click="toSystem">进入系统</el-button>
      </span>
    </div>
    <div class="mb-12">
      <el-checkbox v-model="resultData[month]['state']" :true-label="1" :false-label="0">启用开票系统</el-checkbox>
    </div>
    <!--    <div class="mb-12 ft-weight-bold">操作数据预览</div>-->
    <div class="box-shadow p-10">
      <div class="mb-12">
        <div class="tab-parent flex mb-12">
          <div class="tab-item" :class="tabPosition === 1?'active': ''" @click="choseTab(1)">
            系统操作说明
          </div>
          <!--<div class="tab-item" :class="tabPosition === 2?'active': ''" @click="choseTab(2)">客户编码查看</div>
          <div class="tab-item" :class="tabPosition === 3?'active': ''" @click="choseTab(3)">商品编码查看</div>
          <div class="tab-item" :class="tabPosition === 4?'active': ''" @click="choseTab(4)">发票查看</div>-->
        </div>
      </div>
      <div class="">
        <div v-show="tabPosition === 1">
          <!--企业基本信息设置-->
          <div class="line-height-25">1、进入系统之前，请先创建企业 </div>
          <div class="line-height-25">2、每个月份对应单独的企业，如有多个月份，请维护每个月份的企业信息</div>
          <div class="line-height-25">3、企业默认密码为“123456”，证书口令为“12345678 ”</div>
          <div class="line-height-25">4、登陆系统后维护商品编码和客户编码</div>
          <div class="line-height-25">5、第一次登陆系统首先操作发票的读入</div>
          <div class="line-height-25">6、发票开具</div>
        </div>
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
</template>

<script>
import { createKaiPiaoCompany, delKaiPiaoCompany } from '@/api/accountKu'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'KaiPiao',
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      month: '',
      resultData: {},
      tabPosition: 1,
      company_id: {},
      status: true
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
          if (this.accountAnswer['kai_piao'][v.month]) {
            this.$set(this.resultData, v.month, this.accountAnswer['kai_piao'][v.month])
          } else {
            this.$set(this.resultData, v.month, { company_id: '', account_id: '', state: 0, score: '' })
          }
        })
        this.month = this.monthData[0] // 第一个月份
      } else {
        this.$message.warning('请先维护月份')
      }
    },
    choseMonth() {
      this.tabPosition = 1
    },
    choseTab(index) {
      this.tabPosition = index
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
    },
    createCompany() {
      // 基本信息
      /*  公司名称 this.currentAccountData.company
          税号 this.currentAccountData.tax_no
          开户行账号 this.currentAccountData.account_id
          开户行名称 this.currentAccountData.account_name
          开户行地址 this.currentAccountData.account_address
      * */
      const data = {}
      const monthNumber = this.month.substring(0, 4) + this.month.substring(5, 7)
      data.account_id = this.currentAccountData.id + monthNumber
      data.address = '山东省'
      data.trade_name = this.currentAccountData.company
      data.firm_code = this.currentAccountData.tax_no
      data.bank_code = this.currentAccountData.account_id
      data.bank_address = this.currentAccountData.account_address
      data.is_mini_company = '否'
      data.org_id = 0
      createKaiPiaoCompany(data).then(response => {
        this.$message.success('创建成功')
        this.company_id[this.month] = response.data
        this.resultData[this.month]['company_id'] = this.company_id[this.month]
        this.resultData[this.month]['account_id'] = this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7)
        console.log(this.resultData)
      }).catch()
    },
    // 进入系统
    toSystem() {
      if (this.company_id[this.month] === '' || this.resultData[this.month]['account_id'] === '') {
        this.$message.error('请先创建企业')
      } else {
        window.open(`${window.domain}kaipiao/#/login/account/${this.currentAccountData.id + this.month.substring(0, 4) + this.month.substring(5, 7)}`)
      }
    },
    back() {
      this.$emit('back')
    },
    next() {
      // 判断当前月份有没有启用，没有启用，看看是否有企业id有的话删除
      this.status = false
      for (const i in this.resultData) {
        if (!this.resultData[i].state) {
          // 没启用
          if (this.resultData[i].company_id !== '') {
            // 存在 删除
            delKaiPiaoCompany(this.resultData[i].company_id, { id: this.resultData[i].company_id }).then(response => {
              console.log('删除成功')
              this.$set(this.resultData[i], 'company_id', '')
              this.$set(this.resultData[i], 'account_id', '')
              this.status = true
            }).catch()
          } else {
            this.status = true
          }
        } else {
          // 启用了 有没有创建企业
          if (this.resultData[i].company_id === '') {
            this.$set(this.resultData[i], 'state', 0)
          }
          this.status = true
        }
      }
      if (this.status) {
        this.$store.commit('account/SAVE_KAI_PIAO', this.resultData)
      }
      this.$emit('next')
    }
  }
}
</script>

<style lang="scss" scoped>
  .kaiPiao {
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
