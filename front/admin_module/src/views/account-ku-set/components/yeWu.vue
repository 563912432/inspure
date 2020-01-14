<template>
  <div class="yeWu">
    <div class="mb-12 flex flex-justify-space-between">
      <span>
        <el-select v-model="month" placeholder="请选择月份" size="small" @change="choseMonth">
          <el-option v-for="(item, index) in monthData" :key="index" :label="item" :value="item" />
        </el-select>
        <el-button size="small" type="primary" @click="scoreCopy">计分点同步</el-button>
      </span>
    </div>
    <div>
      <div v-if="resultData[month] && resultData[month].length > 0">
        <div v-for="(item, index) in resultData[month].slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="index">
          <div class="border flex" style="height: 40px;line-height: 40px;padding-left: 10px;padding-right: 10px">
            <span>No:{{ item.number }}</span><span style="display: inline-block;width: 70px;margin-left: 5px">业务描述：</span><span class="flex-1"><el-input v-model="item['material']" size="mini" @change="saveMaterial(index, item['material'])" /></span>
          </div>
          <div class="border flex flex-justify-space-between" style="height: 40px;line-height: 40px;padding-right: 10px">
            <span>
              <span class="ml-12">原始凭证：
                <el-button v-for="(value, i) in item['materialImg']" :key="i" size="mini" plain @click="detailPZ(value['url'])">
                  {{ value['title'] }} <i class="el-icon-close el-icon--right" @click.stop="delPZ(index, i)" />
                </el-button>
              </span>
            </span>
            <span>
              <el-button size="mini" type="primary" @click="addVoucher(index)">添加凭证</el-button>
            </span>
          </div>
          <el-table
            size="mini"
            :data="item['info']"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="行号" width="60" prop="fh" align="center" />
            <el-table-column label="摘要" width="" prop="ti" align="" />
            <el-table-column label="科目" width="" prop="su" show-overflow-tooltip />
            <el-table-column label="借方金额" width="" prop="jie" align="center" />
            <el-table-column label="贷方金额" width="" prop="di" align="center" />
            <el-table-column label="评分百分比" width="120" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.sc" size="mini" class="w-65" /> %
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 40px;line-height: 40px;padding-left: 10px;padding-right: 10px;border: solid 1px #E8E8E8;border-top: none;margin-bottom: 20px">
            <span>凭证日期：{{ item['date'] }}</span>
          </div>
        </div>
        <el-pagination class="text-center" :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="getObjLength(resultData[month])" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
      <div v-else>
        暂无数据
      </div>
      <!--<div class="mt-10">
        <el-button size="mini" type="primary" @click="saveRow">保存</el-button>
      </div>-->
    </div>
    <!--图片查看-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="查看凭证"
      :visible.sync="imageVisible"
      :close-on-click-modal="false"
      width="600px"
      center
      @dragDialog="handleImageDrag"
    >
      <div ref="imageDiv" class="">
        <img :src="imageUrl" alt="" style="width: 100%;height: auto">
      </div>
    </el-dialog>
    <!--原始凭证-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="上传原始凭证"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @dragDialog="handleImportDrag"
    >
      <div ref="importDiv">
        <el-radio-group v-model="importState" class="mb-12">
          <el-radio :label="1">上传原始凭证</el-radio>
          <el-radio :label="2">选择销项发票</el-radio>
        </el-radio-group>
        <el-form
          v-if="importState === 1"
          ref="importForm"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="上传文件" prop="file">
            <el-upload
              ref="upload"
              :limit="1"
              class="upload-demo"
              :action="'assets'"
              :show-file-list="true"
              :auto-upload="true"
            >
              <el-button size="small" type="primary">选择文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-table
          v-else
          size="mini"
          :data="invoiceData"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" width="" prop="number" align="center" />
          <el-table-column label="购买方" width="" prop="buyer" />
          <el-table-column label="合计金额(含税)" width="" prop="jin_e" align="center" />
          <el-table-column label="商品名称" width="" prop="title" align="" show-overflow-tooltip />
        </el-table>
        <el-button size="small" type="primary" class="mt-10">保存</el-button>
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
  name: 'YeWu',
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      month: '',
      allData: [],
      imageVisible: false,
      imageUrl: '',
      importDialogVisible: false,
      importState: 1,
      invoiceData: [
      ],
      resultData: {},
      dialogScoreVisible: false,
      scoreFormData: {
        score_from: '',
        score_to: ''
      },
      scoreRules: {
        score_from: [{ required: true, message: '请选择来源年月', trigger: 'change' }],
        score_to: [{ required: true, message: '请选择目标年月', trigger: 'change' }]
      },
      pageQuery: {
        page: 1,
        page_size: 1
      },
      pagesize: 1,
      currentPage: 1,
      total: 0
    }
  },
  computed: {
    accountAnswer() {
      return this.$store.getters.accountAnswer
    },
    scoreRecordYeWu() {
      return this.$store.state.account.scoreRecord.yeWu
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
          this.$set(this.resultData, v.month, this.accountAnswer.yeWu[v.month])
        })
        this.month = this.monthData[0] // 第一个月份
        // 还原业务内容和分数设置
        /* for (const month in this.resultData) {
          if (this.resultData[month].length > 0) {
            this.resultData[month].forEach((v, i) => {
              // 业务
              const monthRecord = this.scoreRecordYeWu[month]
              if (monthRecord && monthRecord.length > 0) {
                monthRecord.forEach((all, allIndex) => {
                  if (allIndex === i) {
                    this.$set(v, 'date', all.date)
                    this.$set(v, 'material', all.material)
                    this.$set(v, 'materialImg', all.materialImg)
                    // 循环info
                    if (v.info.length > 0) {
                      v.info.forEach(value => {
                        const monthRecordInfo = all['info']
                        if (monthRecordInfo && monthRecordInfo.length > 0) {
                          monthRecordInfo.forEach(obj => {
                            if (obj.hasOwnProperty(value.jie + value.da + value.su + value.di)) {
                              this.$set(value, 'sc', obj[value.jie + value.da + value.su + value.di])
                            }
                          })
                        }
                      })
                    }
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
    // 切换月份
    choseMonth() {
      this.currentPage = 1
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
            value['info'].forEach(v => {
              fromData.push(
                { ti: v.ti, su: v.su, sc: v.sc }
              )
            })
          })
          toScore.forEach((value, index) => {
            fromData.forEach((fromData, fromIndex) => {
              if (fromData['sc'] && parseInt(fromData['sc']) > 0) {
                value['info'].forEach((v, i) => {
                  if (v.ti === fromData.ti && v.su === fromData.su) {
                    this.$set(v, 'sc', fromData['sc'])
                  }
                })
              }
            })
          })
          this.$message.success('同步成功')
          this.dialogScoreVisible = false
        }
      })
    },
    // 保存数据
    saveRow() {
      this.$store.commit('account/SAVE_YE_WU', this.resultData)
      this.$message.success('保存成功')
      console.log(this.$store.getters.accountAnswer)
    },
    // 业务保存
    saveMaterial(index, value) {
      // this.$set(this.resultData[this.month][index], 'material', value)
    },
    handleImageDrag() {
      this.$refs['imageDiv'].blur()
    },
    // 添加凭证
    addVoucher() {
      this.importDialogVisible = true
    },
    // 凭证详情
    detailPZ(url) {
      this.imageUrl = url
      this.imageVisible = true
    },
    // 删除凭证
    delPZ(index, i) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resultData[this.month][index]['materialImg'].splice(i, 1)
        this.$message.success('删除成功')
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleSoreDrag() {
      this.$refs['divScore'].blur()
    },
    handleImportDrag() {
      this.$refs['importDiv'].blur()
    },
    getObjLength(data) {
      const array = Object.keys(data)
      return array.length
    },
    // 2、控制方法
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .yeWu{
    padding: 10px 0 10px 10px;
    .border{
      border: solid 1px #E8E8E8;
      border-bottom: none;
    }
  }
</style>
