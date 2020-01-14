<template>
  <div class="kaiPiao">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
        <el-button size="small" type="primary" @click="scoreCopy">计分点同步</el-button>
      </span>
      <span>
        <el-button size="small" type="primary">进入系统</el-button>
      </span>
    </div>
    <div class="mb-12">
      <el-checkbox v-model="resultData[month]['state']" :true-label="1" :false-label="0">启用开票系统</el-checkbox>
    </div>
    <div class="mb-12">
      <div class="tab-parent flex mb-12">
        <div class="tab-item" :class="tabPosition === 1?'active': ''" @click="choseTab(1)">
          基本信息维护
        </div>
        <div class="tab-item" :class="tabPosition === 2?'active': ''" @click="choseTab(2)">
          设置计分百分比
        </div>
      </div>
    </div>
    <div class="p-10">
      <div v-show="tabPosition === 1">
        <!--企业基本信息设置-->
        <el-form
          ref="companyInfo"
          :model="companyInfo"
          :rules="rules"
          label-width="150px"
          class="companyInfo"
        >
          <el-form-item prop="province" label="省份" class="fl">
            <el-input v-model="companyInfo.province" class="w-223" size="mini" type="text" placeholder="例：山东" clearable />
          </el-form-item>
          <el-form-item prop="user_name" label="默认初始用户名" class="fl">
            <el-input v-model="companyInfo.user_name" class="w-223" size="mini" type="text" placeholder="例：管理员" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="password" label="密码" class="fl">
            <el-input v-model="companyInfo.password" class="w-223" size="mini" type="text" placeholder="例：123456" clearable />
          </el-form-item>
          <el-form-item prop="token" label="口令" class="fl">
            <el-input v-model="companyInfo.token" class="w-223" size="mini" type="text" placeholder="例：12345678" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="remark" label="默认初始用户备注" class="fl">
            <el-input v-model="companyInfo.remark" class="w-223" size="mini" type="text" placeholder="例：备注" clearable />
          </el-form-item>
          <el-form-item prop="address" label="公司地址" class="fl">
            <el-input v-model="companyInfo.address" class="w-223" size="mini" type="text" placeholder="例：山东省淄博市张店区德胜路85号" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="telno" label="联系电话" class="fl">
            <el-input v-model="companyInfo.telno" class="w-223" size="mini" type="text" placeholder="例：3918359" clearable />
          </el-form-item>
          <el-form-item prop="bank_address" label="开户行地址" class="fl">
            <el-input v-model="companyInfo.bank_address" class="w-223" size="mini" type="text" placeholder="例：中国建设银行德胜路支行" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="bank_code" label="银行账号" class="fl">
            <el-input v-model="companyInfo.bank_code" class="w-223" size="mini" type="text" placeholder="例：银行账号" clearable />
          </el-form-item>
          <el-form-item prop="zhuan_code" label="专票代码" class="fl">
            <el-input v-model="companyInfo.zhuan_code" class="w-223" size="mini" type="text" placeholder="长度为10位 例：3700114140" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="zhuan_code_start" label="专票代码起始号码" class="fl">
            <el-input v-model="companyInfo.zhuan_code_start" class="w-223" size="mini" type="text" placeholder="长度为8位 例：3700114140" clearable />
          </el-form-item>
          <el-form-item prop="zhuan_code_end" label="专票代码结束号码" class="fl">
            <el-input v-model="companyInfo.zhuan_code_end" class="w-223" size="mini" type="text" placeholder="例：3700114140" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="zhuan_xiane" label="专票限额" class="fl">
            <el-input v-model="companyInfo.zhuan_xiane" class="w-223" size="mini" type="text" placeholder="例：10000.00" clearable />
          </el-form-item>

          <el-form-item prop="po_code" label="普票代码" class="fl">
            <el-input v-model="companyInfo.po_code" class="w-223" size="mini" type="text" placeholder="长度为10位 例：3700114140" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="po_code_start" label="普票代码起始号码" class="fl">
            <el-input v-model="companyInfo.po_code_start" class="w-223" size="mini" type="text" placeholder="长度为8位 例：3700114140" clearable />
          </el-form-item>
          <el-form-item prop="po_code_end" label="普票代码结束号码" class="fl">
            <el-input v-model="companyInfo.po_code_end" class="w-223" size="mini" type="text" placeholder="例：3700114140" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="po_xiane" label="普票限额" class="fl">
            <el-input v-model="companyInfo.po_xiane" class="w-223" size="mini" type="text" placeholder="例：10000.00" clearable />
          </el-form-item>
          <el-form-item prop="kaipiao_time" label="开票时间" class="fl">
            <el-input v-model="companyInfo.kaipiao_time" class="w-223" size="mini" type="text" placeholder="例：2018-04-01" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="lingpiao_time" label="领票时间" class="fl">
            <el-input v-model="companyInfo.lingpiao_time" class="w-223" size="mini" type="text" placeholder="例：2018-04-01" clearable />
          </el-form-item>
          <el-form-item prop="lock_day" label="锁死日期" class="fl">
            <el-input v-model="companyInfo.lock_day" class="w-223" size="mini" type="text" placeholder="例：2018-04-01" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="baoshui_day_start" label="上次报税日期" class="fl">
            <el-input v-model="companyInfo.baoshui_day_start" class="w-223" size="mini" type="text" placeholder="例：2018-04-01" clearable />
          </el-form-item>
          <el-form-item prop="chaoshui_day_start" label="抄税起始日期" class="fl">
            <el-input v-model="companyInfo.chaoshui_day_start" class="w-223" size="mini" type="text" placeholder="例：2018-04-01" clearable />
          </el-form-item>
          <div class="clear-float" />
          <el-form-item prop="red_code_start" label="红字流水起始号码" class="fl">
            <el-input v-model="companyInfo.red_code_start" class="w-223" size="mini" type="text" placeholder="例：661558640110161227158056。长度24位，不以0开头" clearable />
          </el-form-item>
          <div class="clear-float" />
        </el-form>
      </div>
      <div v-if="tabPosition === 2">
        <el-table
          size="mini"
          :data="resultData[month]['info']"
          border
          fit
          highlight-current-row
          :stripe="true"
          style="width: 100%;"
        >
          <el-table-column label="购买方" width="" prop="customer_name" align="center" />
          <el-table-column label="购买方税号" width="" prop="customer_taxcode" align="center" />
          <el-table-column label="商品名称" align="" width="" prop="goods" />
          <el-table-column label="含税金额" align="center" width="" prop="money" />
          <el-table-column label="计分百分比" width="120" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.score" size="mini" class="w-65" /> %
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mt-10">
        <el-button size="small" type="primary" @click="saveCompanyInfo">保 存</el-button>
      </div>
    </div>
    <!--计分点同步-->
    <el-dialog v-el-drag-dialog class="score-dialog" width="400px" :modal="false" :close-on-click-modal="false" title="计分点同步" :visible.sync="dialogScoreVisible" @dragDialog="handleSoreDrag">
      <el-form ref="cateTypeForm" :model="scoreFormData" :rules="scoreRules" label-position="left" label-width="80px">
        <el-form-item label="源年月" prop="score_from">
          <el-select v-model="scoreFormData.score_from" placeholder="请选择年月" size="mini">
            <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标年月" prop="score_to">
          <el-select v-model="scoreFormData.score_to" placeholder="请选择年月" size="mini">
            <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div ref="divScore" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveCopyScore('cateTypeForm')">
          同步
        </el-button>
        <el-button size="small" plain @click="dialogScoreVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
      companyInfo: {},
      rules: {
        province: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        user_name: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        password: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        token: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        remark: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        address: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        telno: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        bank_address: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        bank_code: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        zhuan_code: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        zhuan_code_start: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        zhuan_code_end: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        zhuan_xiane: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        po_code: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        po_code_start: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        po_code_end: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        po_xiane: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        kaipiao_time: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        lingpiao_time: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        lock_day: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        baoshui_day_start: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        chaoshui_day_start: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }],
        red_code_start: [{ required: true, message: '必填项必须要填写', trigger: 'blur' }]
      },
      dialogScoreVisible: false,
      scoreFormData: {
        score_from: '',
        score_to: ''
      },
      scoreRules: {
        score_from: [{ required: true, message: '请选择来源年月', trigger: 'change' }],
        score_to: [{ required: true, message: '请选择目标年月', trigger: 'change' }]
      }
    }
  },
  computed: {
    accountAnswer() {
      return this.$store.getters.accountAnswer
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.accountAnswer.month && this.accountAnswer.month.length > 0) {
        this.monthData = this.accountAnswer.month // 取总线上的月份
        this.month = this.monthData[0] // 第一个月份
        this.resultData = this.accountAnswer.kaiPiao
        this.companyInfo = this.resultData[this.month]['config']
      } else {
        this.$message.warning('请先维护月份')
        this.$emit('changeState', this.$store.getters.addAccountKuType.Month)
      }
    },
    choseMonth() {
      this.companyInfo = this.resultData[this.month]['config']
      this.tabPosition = 1
    },
    scoreCopy() {
      this.dialogScoreVisible = true
    },
    saveCopyScore(formName) {
      // 保存计分点
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const fromScore = this.resultData[this.scoreFormData.score_from]['info']
          const toScore = this.resultData[this.scoreFormData.score_to]['info']
          const fromData = []
          fromScore.forEach((v) => {
            fromData.push(
              { customer_name: v.customer_name, customer_taxcode: v.customer_taxcode, goods: v.goods, money: v.money, score: v.score }
            )
          })
          toScore.forEach((v, index) => {
            fromData.forEach((fromData, fromIndex) => {
              if (v.customer_name === fromData.customer_name && v.customer_taxcode === fromData.customer_taxcode && v.goods === fromData.goods && v.money === fromData.money) {
                v['score'] = fromData['score']
                this.$set(v, 'score', fromData['score'])
              }
            })
          })
          this.$message.success('同步成功')
          this.dialogScoreVisible = false
        }
      })
    },
    choseTab(index) {
      this.tabPosition = index
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
    },
    saveCompanyInfo() {
      this.$refs['companyInfo'].validate((valid) => {
        if (valid) {
          this.$store.commit('account/SAVE_KAI_PIAO', this.resultData)
          this.$message.success('保存成功')
          console.log(this.$store.getters.accountAnswer)
        }
      })
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
