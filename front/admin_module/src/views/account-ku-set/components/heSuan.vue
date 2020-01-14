<template>
  <div v-loading="loading" class="heSuan">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
        <el-button size="small" type="primary" @click="scoreCopy">计分点同步</el-button>
      </span>
    </div>
    <div>
      <!--<div v-if="allData.length > 0" class="tab-parent flex mb-12">
        &lt;!&ndash;eslint-disable-next-line&ndash;&gt;
        <div v-for="(item, index) in allData" :key="index" class="tab-item" :class="tabPosition === index?'active': ''" @click="choseTab(index, item['name'])">
          {{ item['name'] }}
        </div>
        <div class="flex-1 flex flex-align-center flex-justify-center pointer" style="position: relative">
          <div @click="() => arrowState = !arrowState"><span>自定义辅助类别</span><i class="ml-3" :class="arrowState?'el-icon-arrow-up':'el-icon-arrow-down'"></i></div>
          <div v-if="arrowState" class="cate-item box-shadow">
            &lt;!&ndash;eslint-disable-next-line&ndash;&gt;
            <div v-for="(item, index) in allData" :key="index" v-if="index >= 5" :class="tabPosition === index?'cate-more-active': 'cate-more'" @click="choseTab(index, item['name'])">{{ item['name'] }}</div>
            <div class="line"></div>
            <div class="f-13 text-center" style="color: #4286D8" @click="addCate">
              <i class="el-icon-circle-plus-outline f-15"></i> 新增类别
            </div>
          </div>
        </div>
      </div>
      <div class="mb-12">
        <el-input v-model="listQuery.title" size="mini" clearable placeholder="请输入模糊查询条件" class="w-190">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>-->
      <div v-if="resultData[month] && resultData[month].length > 0" class="tab-parent flex mb-12">
        <div v-for="(item, index) in resultData[month]" :key="index" class="tab-item" :class="tabPosition === index?'active': ''">
          <div v-if="item.name" style="width: 100%;height: 100%" @click="choseTab(index)">
            {{ item['name'] }}
          </div>
        </div>
      </div>
      <div class="mb-12">
        <el-table
          size="mini"
          :data="resultData[month]?resultData[month][tabPosition]?resultData[month][tabPosition]['info']?resultData[month][tabPosition]['info']:[]:[]:[]"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="编号" width="80" prop="number" align="center">
            <template slot-scope="{row}">
              <!--              <el-input v-model="row.number" size="mini" />-->
              {{ row.nu }}
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="{row}">
              <!--              <el-input v-model="row.title" size="mini" />-->
              {{ row.ti }}
            </template>
          </el-table-column>
          <el-table-column label="计分百分比" width="120" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.sc" size="mini" class="w-65" /> %
            </template>
          </el-table-column>
          <!--          <el-table-column label="操作" width="80" align="center">-->
          <!--            <template slot-scope="{row}">-->
          <!--              <i class="el-icon-circle-close f-18 pointer ft-weight-bold" style="color: #F74C23" @click="delRow(row.number)"></i>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </div>
      <div>
        <!--        <el-button size="mini" plain @click="addRow">新增一行</el-button>-->
        <!--        <el-button size="mini" type="primary" @click="saveRow">保存</el-button>-->
      </div>
    </div>
    <!--新增类别-->
    <el-dialog v-el-drag-dialog class="branch-dialog" width="400px" :modal="false" :close-on-click-modal="false" :title="cateType[typeStatus]" :visible.sync="dialogCateTypeVisible" @dragDialog="handleCateTypeDrag">
      <el-form ref="cateTypeForm" :rules="cateTypeRules" :model="cateTypeFormData" label-position="left" label-width="80px">
        <el-form-item label="类别名称" prop="cate_type_name">
          <el-input v-model="cateTypeFormData.cate_type_name" clearable size="mini" />
        </el-form-item>
      </el-form>
      <div ref="divCateType" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveCateType('cateTypeForm')">
          确定
        </el-button>
        <el-button size="small" plain @click="dialogCateTypeVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
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
  name: 'HeSuan',
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
      checkState: false,
      arrowState: false,
      cateType: {
        'add': '新增',
        'update': '编辑'
      },
      typeStatus: '',
      dialogCateTypeVisible: false,
      cateTypeFormData: {
        cate_type_name: ''
      },
      cateTypeRules: {
        cate_type_name: [{ required: true, message: '分类名称必须填写', trigger: 'blur' }]
      },
      dialogScoreVisible: false,
      scoreFormData: {
        score_from: '',
        score_to: ''
      },
      scoreRules: {
        score_from: [{ required: true, message: '请选择来源年月', trigger: 'change' }],
        score_to: [{ required: true, message: '请选择目标年月', trigger: 'change' }]
      },
      resultData: {},
      loading: false
    }
  },
  computed: {
    accountAnswer() {
      return this.$store.getters.accountAnswer
    },
    scoreRecordHeSuan() {
      return this.$store.state.account.scoreRecord.heSuan
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = true
      setTimeout(() => {
        if (this.accountAnswer.accountData && this.accountAnswer.accountData.length > 0) {
          this.accountAnswer.accountData.forEach(v => {
            this.monthData.push(v.month)
            // this.$set(this.resultData, v.month, this.accountAnswer.heSuan[v.month])
          })
          this.month = this.monthData[0] // 第一个月份
          this.resultData = this.accountAnswer.heSuan

          // 还原分数设置
          /* for (const month in this.resultData) {
            if (this.resultData[month].length > 0) {
              this.resultData[month].forEach((v, i) => {
                if (v.info.length > 0) {
                  v.info.forEach(value => {
                    const monthRecord = this.scoreRecordHeSuan[month]
                    if (monthRecord && monthRecord.length > 0) {
                      monthRecord.forEach(obj => {
                        if (obj.hasOwnProperty(i + '|' + value.ti)) {
                          this.$set(value, 'sc', obj[i + '|' + value.ti])
                        }
                      })
                    }
                  })
                }
              })
            }
          }*/
          this.loading = false
        } else {
          this.$message.warning('请先维护月份')
          this.loading = false
        }
      }, 200)
    },
    // 切换月份
    choseMonth() {
      this.tabPosition = 0
    },
    // 切换tab
    choseTab(state, name) {
      // let status = true
      // const data = this.resultData[this.month][this.tabPosition]['info']
      this.tabPosition = state
      // this.allData = this.accountAnswer.heSuan[this.month] // 当前月份的全部数据
      /*  for (let i = 0; i < data.length; i++) {
        if (data.number === '' && data.title === '' && data.score === '') {
          this.$message.warning('请填写完成信息')
          status = false
          break
        }
      }
      if (status) {
        this.tabPosition = state
        this.allData = this.accountAnswer.heSuan[this.month] // 当前月份的全部数据
      }*/
    },
    // 新增一行
    addRow() {
      this.tableData.push({ number: '', title: '', score: '' })
    },
    // 删除当前行
    delRow(number) {
      if (this.tableData.length > 1) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.forEach((value, index) => {
            if (value.number === number) {
              this.tableData.splice(index, 1)
            }
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 新增类别
    addCate() {
      this.cateTypeFormData = {
        cate_type_name: ''
      }
      this.typeStatus = 'add'
      this.dialogCateTypeVisible = true
      this.$nextTick(() => {
        this.$refs['cateTypeForm'].clearValidate()
      })
    },
    // 计分点同步
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
            value['info'].forEach(v => {
              fromData.push(
                { name: value.name, nu: v.nu, ti: v.ti, sc: v.sc }
              )
            })
          })
          toScore.forEach((value, index) => {
            fromData.forEach((fromData, fromIndex) => {
              if (fromData['sc'] && parseInt(fromData['sc']) > 0) {
                if (fromData.name === value.name) {
                  value['info'].forEach((v, i) => {
                    if (v.nu === fromData.nu && v.ti === fromData.ti) {
                      this.$set(v, 'sc', fromData['sc'])
                    }
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
    // 保存
    saveRow(formName) {
      this.$store.commit('account/SAVE_HE_SUAN', this.resultData)
      this.$message.success('保存成功')
      console.log(this.$store.getters.accountAnswer)
    },
    handleCateTypeDrag() {
      this.$refs['divCateType'].blur()
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
    },
    // 保存分类名称
    saveCateType(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let state = true
          // 检测名称是否重复
          console.log(this.allData)
          this.allData.forEach(v => {
            if (v['name'] === this.cateTypeFormData.cate_type_name) {
              this.$message.warning('分类名称不允许重复')
              state = false
            }
          })
          if (state) {
            this.allData.push([{ name: this.cateTypeFormData.cate_type_name, info: [{ number: '', title: '', score: '' }] }])
            this.$message.success('保存成功')
            this.dialogCateTypeVisible = false
          }
        }
      })
    }
  }
}
</script>
<style>
  .heSuan .el-radio-button__inner{
    width: 100px!important;
    padding: 8px 0!important;
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
  .heSuan{
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
      border-right: none;
      /*width: 560px;*/
      /*width: 500px;*/
      .tab-item{
        /*padding: 0 27px;*/
        width: 120px;
        border-right: solid 1px #DCDFE6;
        border-top: solid 1px #DCDFE6;
        text-align: center;
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
