<template>
  <div class="qiChu">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
        <el-button size="small" type="primary" @click="scoreCopy">计分点同步</el-button>
      </span>
    </div>
    <div>
      <div v-if="resultData[month] && resultData[month].length > 0" class="tab-parent flex mb-12">
        <!--eslint-disable-next-line-->
        <div v-for="(item, index) in resultData[month]" :key="index" class="tab-item" :class="tabPosition === index?'active': ''">
          <div v-if="item.mc" @click="choseTab(index)">
            {{ item['mc'] }}
          </div>
        </div>
      </div>
      <div class="mb-12">
        <el-table
          size="mini"
          :data="resultData[month]?resultData[month][tabPosition]?resultData[month][tabPosition]['li']?resultData[month][tabPosition]['li']:[]:[]:[]"
          row-key="nu"
          border
          fit
          highlight-current-row
          :stripe="true"
          style="width: 100%;"
          :tree-props="{children: 'cd', hasChildren: 'hasChildren'}"
        >
          <el-table-column label="科目编号" width="200" prop="number">
            <template slot-scope="{row}">
              <span class="qiChu-table-column height-40 line-height-40">
                <span style="margin-right: 5px"><span v-if="!row.cd || row.cd.length ===0" class="circle-icon" /><span>{{ row.nu }}</span></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="科目名称" width="150" prop="ti" />
          <el-table-column label="方向" align="center" width="50" prop="fx" />
          <el-table-column label="汇率" align="center" width="" prop="hl" />
          <el-table-column label="外币名称" width="" prop="wb" />
          <el-table-column label="期初余额">
            <el-table-column prop="sl" label="数量" width="50" />
            <el-table-column prop="yb" label="原币" width="50" />
            <el-table-column prop="wb" label="本位币" width="60" />
          </el-table-column>
          <el-table-column label="计分百分比" width="120" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.sc" size="mini" class="w-65" /> %
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div>
        <el-button size="mini" type="primary" @click="saveRow">保存</el-button>
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
  name: 'QiChu',
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      month: '',
      tabPosition: 0,
      listQuery: {
        title: ''
      },
      allData: [],
      tableData: [],
      resultData: {},
      checkState: false,
      arrowState: false,
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
    scoreRecordQiChu() {
      return this.$store.state.account.scoreRecord.qiChu
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
        this.resultData = this.accountAnswer.qiChu
        // 还原分数设置
        /* for (const month in this.resultData) {
          if (this.resultData[month].length > 0) {
            this.resultData[month].forEach((v, i) => {
              if (v.li.length > 0) {
                v.li.forEach(value => {
                  const monthRecord = this.scoreRecordQiChu[month]
                  if (monthRecord && monthRecord.length > 0) {
                    monthRecord.forEach(obj => {
                      if (obj.hasOwnProperty(value.nu + '|' + value.bw)) {
                        this.$set(value, 'sc', obj[value.nu + '|' + value.bw])
                      }
                      // 子科目
                      this.resetQiChuChildScore(value, obj)
                    })
                  }
                })
              }
            })
          }
        }*/
      } else {
        this.$message.warning('请先维护月份')
      }
    },
    resetQiChuChildScore(item, obj) {
      if (item.cd && item.cd.length > 0) {
        item.cd.forEach(v => {
          if (obj.hasOwnProperty(v.nu + '|' + v.bw)) {
            this.$set(v, 'sc', obj[v.nu + '|' + v.bw])
          }
          this.resetQiChuChildScore(v, obj)
        })
      } else {
        return false
      }
    },
    // 切换月份
    choseMonth() {
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
          const fromScore = this.resultData[this.scoreFormData.score_from]
          const toScore = this.resultData[this.scoreFormData.score_to]
          const fromData = []
          fromScore.forEach((value) => {
            value['li'].forEach(v => {
              if (v.sc !== '' && parseInt(v.sc) > 0) {
                fromData.push(
                  { mc: value.mc, nu: v.nu, sc: v.sc }
                )
                this.handleChildren(v, fromData)
              }
            })
          })
          toScore.forEach((value, index) => {
            fromData.forEach((fromData, fromIndex) => {
              if (fromData['sc'] && parseInt(fromData['sc']) > 0) {
                if (fromData.mc === value.mc) {
                  value['li'].forEach((v, i) => {
                    if (v.nu === fromData.nu) {
                      this.$set(v, 'sc', fromData['sc'])
                    }
                    this.copyChildren(v, fromData)
                  })
                }
              }
            })
          })
          this.$message.success('同步成功')
          this.dialogScoreVisible = false
        }
      })
    },
    // 拆子元素
    handleChildren(item, data) {
      if (item.cd && item.cd.length > 0) {
        item.cd.forEach(v => {
          if (v.sc !== '' && parseInt(v.sc) > 0) {
            data.push({ mc: v.ca, nu: v.nu, sc: v.sc })
            this.handleChildren(v, data)
          }
        })
      } else {
        return data
      }
    },
    // 同步子元素
    copyChildren(item, data) {
      if (item.cd && item.cd.length > 0) {
        item.cd.forEach(v => {
          if (v.nu === data.nu) {
            console.log(123)
            this.$set(v, 'sc', data['sc'])
          }
          this.copyChildren(v, data)
        })
      } else {
        return false
      }
    },
    // 保存
    saveRow() {
      this.$store.commit('account/SAVE_QI_CHU', this.resultData)
      this.$message.success('保存成功')
      console.log(this.$store.getters.accountAnswer)
    },
    handleSubjectDrag() {
      this.$refs['divSubject'].blur()
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
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
  .qiChu .el-radio-button__inner{
    width: 100px!important;
    padding: 8px 0!important;
  }
  .qiChu td{
    padding: 0!important;
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
  .qiChu{
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
      border-left: solid 1px #DCDFE6;
      /*width: 560px;*/
      .tab-item{
        width: 120px;
        text-align: center;
        border-right: solid 1px #DCDFE6;
        border-top: solid 1px #DCDFE6;
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
