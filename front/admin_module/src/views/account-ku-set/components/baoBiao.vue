<template>
  <div class="baoBiao">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
        <el-button size="small" type="primary" @click="scoreCopy">计分点同步</el-button>
      </span>
    </div>
    <div class="mb-12">
      <div v-if="resultData[month] && resultData[month].length > 0" class="tab-parent flex mb-12">
        <!--eslint-disable-next-line-->
        <div v-for="(item, index) in resultData[month]" :key="index" class="tab-item" :class="tabPosition === index?'active': ''">
          <div v-if="item.name" @click="choseTab(index)">
            {{ item['name'] }}
          </div>
        </div>
      </div>
    </div>
    <div>
      <ZiChan v-if="tabPosition === 0" :data="ziChan" />
      <LiRun v-if="tabPosition === 1" :data="liRun" />
      <XianJin v-if="tabPosition === 2" :data="xianJin" />
    </div>
    <!--<div class="mt-10">
      <el-button size="mini" type="primary" @click="saveRow">保存</el-button>
    </div>-->
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
import elDragDialog from '@/directive/el-drag-dialog'
import ZiChan from './ziChan'
import LiRun from './liRun'
import XianJin from './xianJin' // base on element-ui
export default {
  name: 'BaoBiao',
  components: { XianJin, LiRun, ZiChan },
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      month: '',
      tabPosition: 0,
      allData: {},
      ziChan: [],
      liRun: [],
      xianJin: [],
      resultData: {},
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
    },
    scoreRecordBaoBiao() {
      return this.$store.state.account.scoreRecord.baoBiao
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
        this.resultData = this.accountAnswer.baoBiao
        // 还原分数设置
        /* for (const month in this.resultData) {
          if (this.resultData[month].length > 0) {
            this.resultData[month].forEach((v, i) => {
              if (v.name === '资产负债表') {
                if (v.li.length > 0) {
                  let index = 1
                  v.li.forEach(value => {
                    const monthRecord = this.scoreRecordBaoBiao[month]['zcfj']
                    if (monthRecord && monthRecord.length > 0) {
                      monthRecord.forEach(obj => {
                        if (obj.hasOwnProperty(index + '|' + value.fy)) {
                          this.$set(value, 'fs', obj[index + '|' + value.fy])
                        }
                        if (value.zc !== '') {
                          index = index + 1
                          if (obj.hasOwnProperty(index + '|' + value.zy)) {
                            this.$set(value, 'zs', obj[index + '|' + value.zy])
                          }
                        }
                      })
                    }
                    index++
                  })
                }
              }
              if (v.name === '利润表') {
                if (v.li.length > 0) {
                  v.li.forEach(value => {
                    const monthRecord = this.scoreRecordBaoBiao[month]['lr']
                    if (monthRecord && monthRecord.length > 0) {
                      monthRecord.forEach(obj => {
                        if (obj.hasOwnProperty(value.hang + '|' + value.jin_e)) {
                          this.$set(value, 'score', obj[value.hang + '|' + value.jin_e])
                        }
                      })
                    }
                  })
                }
              }
              if (v.name === '现金流量表') {
                if (v.li.length > 0) {
                  v.li.forEach(value => {
                    const monthRecord = this.scoreRecordBaoBiao[month]['xj']
                    if (monthRecord && monthRecord.length > 0) {
                      monthRecord.forEach(obj => {
                        if (obj.hasOwnProperty(value.hh + '|' + value.je)) {
                          this.$set(value, 'sc', obj[value.hh + '|' + value.je])
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        }*/
        this.ziChan = this.resultData[this.month] ? this.resultData[this.month][0] ? this.resultData[this.month][0]['li'] ? this.resultData[this.month][0]['li'] : [] : [] : []
        this.liRun = this.resultData[this.month] ? this.resultData[this.month][1] ? this.resultData[this.month][1]['li'] ? this.resultData[this.month][1]['li'] : [] : [] : []
        this.xianJin = this.resultData[this.month] ? this.resultData[this.month][2] ? this.resultData[this.month][2]['li'] ? this.resultData[this.month][2]['li'] : [] : [] : []
      } else {
        this.$message.warning('请先维护月份')
      }
    },
    // 切换月份
    choseMonth() {
      this.ziChan = this.resultData[this.month] ? this.resultData[this.month][0] ? this.resultData[this.month][0]['li'] ? this.resultData[this.month][0]['li'] : [] : [] : []
      this.liRun = this.resultData[this.month] ? this.resultData[this.month][1] ? this.resultData[this.month][1]['li'] ? this.resultData[this.month][1]['li'] : [] : [] : []
      this.xianJin = this.resultData[this.month] ? this.resultData[this.month][2] ? this.resultData[this.month][2]['li'] ? this.resultData[this.month][2]['li'] : [] : [] : []
      this.tabPosition = 0
    },
    // 切换tab
    choseTab(state) {
      this.tabPosition = state
    },
    scoreCopy() {
      this.dialogScoreVisible = true
    },
    saveCopyScore(formName) {
      // 保存计分点
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const ziChanFromData = this.resultData[this.scoreFormData.score_from][0]['li']
          const ziChanToData = this.resultData[this.scoreFormData.score_to][0]['li']
          const liRunFromData = this.resultData[this.scoreFormData.score_from][1]['li']
          const liRunToData = this.resultData[this.scoreFormData.score_to][1]['li']
          const xianJinFromData = this.resultData[this.scoreFormData.score_from][2]['li']
          const xianJinToData = this.resultData[this.scoreFormData.score_to][2]['li']
          // 资产
          ziChanFromData.forEach(v => {
            ziChanToData.forEach(value => {
              if (v['zs'] && parseInt(v['zs']) > 0) {
                if (value.zc === v.zc) {
                  this.$set(value, 'zs', v['zs'])
                }
              }
              if (v['fs'] && parseInt(v['fs']) > 0) {
                if (value.zc === v.zc) {
                  this.$set(value, 'fs', v['fs'])
                }
              }
            })
          })
          // 利润
          liRunFromData.forEach(v => {
            liRunToData.forEach(value => {
              if (v['score'] && parseInt(v['score']) > 0) {
                if (value.title === v.title) {
                  this.$set(value, 'score', v['score'])
                }
              }
            })
          })
          // 现金
          xianJinFromData.forEach(v => {
            xianJinToData.forEach(value => {
              if (v['sc'] && parseInt(v['sc']) > 0) {
                if (value.ti === v.ti) {
                  this.$set(value, 'sc', v['sc'])
                }
              }
            })
          })
          this.$message.success('同步成功')
          this.dialogScoreVisible = false
        }
      })
    },
    saveRow() {
      this.$store.commit('account/SAVE_BAO_BIAO', this.resultData)
      this.$message.success('保存成功')
      console.log(this.$store.getters.accountAnswer)
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
    },
    handleSubjectDrag() {
      this.$refs['divSubject'].blur()
    }
  }
}
</script>
<style>
  .height-40 {
    height: 40px;
    padding: 0;
    margin: 0;
  }
  .line-height-40 {
    line-height: 40px;
  }
  .f-18{
    font-size: 18px;
  }
  .line{
    height: 1px;
    background-color: #DCDFE6;
    margin: 5px;
  }
</style>
<style lang="scss" scoped>
  .baoBiao{
    padding: 10px 0 10px 10px;
    font-size: 13px;
    .cate-item{
      position: absolute;
      top: 30px;
      width: 140px;
      padding: 5px 10px;
      z-index: 10;
      background-color: #ffffff;
    }
    .tab-parent{
      height: 30px;
      line-height: 30px;
      border: solid 1px #DCDFE6;
      border-right: none;
      width: 360px;
      .tab-item{
        width: 120px;
        text-align: center;
        border-right: solid 1px #DCDFE6;
        border-bottom: solid 2px transparent;
        cursor: pointer;
      }
      .tab-item.active{
        color: #93c343;
        border-bottom-color: #93c343;
      }
      .cate-more-active{
        color: #93c343;
      }
      .cate-more{
        color: #333333;
      }
    }
    .circle-icon{
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: solid 1px #93c343;
      margin-right: 3px;
      margin-left: 5px;
    }
    .tree-icon-blue{
      color: #84CDED;
      font-weight: bold
    }
    .tree-icon-orange{
      color: #F5CD1D;
      font-weight: bold
    }
    .tree-icon-red{
      color: #F85832;
      font-weight: bold
    }
  }
</style>
