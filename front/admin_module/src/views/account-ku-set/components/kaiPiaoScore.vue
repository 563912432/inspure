<template>
  <div class="kaiPiaoScore">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
        <el-button size="small" type="primary" @click="scoreCopy">计分点同步</el-button>
      </span>
    </div>
    <div class="mb-12 ft-weight-bold">
      设置计分百分比
    </div>
    <div class="">
      <span>开票系统在账套库中的分数占</span>
      <el-input v-model="resultData[month]['score']" size="mini" class="w-65" />
      <span>%</span>
      <!--<div class="mt-10">
        <el-button size="small" type="primary" @click="saveCompanyInfo">保 存</el-button>
      </div>-->
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
  name: 'KaiPiaoScore',
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      month: '',
      resultData: {},
      tabPosition: 1,
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
      if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
        this.accountAnswer.accountData.forEach(v => {
          this.monthData.push(v.month)
        })
        this.month = this.monthData[0] // 第一个月份
        this.resultData = this.accountAnswer['kai_piao']
      } else {
        this.$message.warning('请先维护月份')
      }
    },
    choseMonth() {
      this.tabPosition = 1
    },
    scoreCopy() {
      this.dialogScoreVisible = true
    },
    saveCopyScore(formName) {
      // 保存计分点
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.resultData[this.scoreFormData.score_from]['score'] && parseInt(this.resultData[this.scoreFormData.score_from]['score']) > 0) {
            this.resultData[this.scoreFormData.score_to]['score'] = this.resultData[this.scoreFormData.score_from]['score']
          }
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
      this.$store.commit('account/SAVE_KAI_PIAO', this.resultData)
      this.$message.success('保存成功')
      console.log(this.$store.getters.accountAnswer)
    }
  }
}
</script>

<style lang="scss" scoped>
  .kaiPiaoScore {
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
