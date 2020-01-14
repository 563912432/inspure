<style>
  .zuhe {
    position: relative;
  }

  .ql-editor {
    height: 80px;
  }

  .el-upload {
    display: block;
  }

  .ql-toolbar.ql-snow {
    padding: 0;
  }

</style>
<template>
  <div class="zuhe p-20">
    <el-form ref="form" label-width="100px" :model="tm" :rules="rules">
      <div class="flex">
        <el-form-item label="难度：" prop="difficulty_id" required>
          <el-select v-model="tm.difficulty_id" placeholder="请选择难度" size="mini" clearable class="w-135">
            <el-option v-for="item in levelList" :key="item.key" :label="item.difficulty" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识点：" class="flex-1" required>
          <div class="w-100p flex">
            <span><el-button type="primary" size="small" class="fl" @click="handleCreatePoint">添加</el-button></span>
            <div class="point-div flex-1" style="margin-left: 5px">
              <el-button v-for="(item, index) in pointArr" :key="index" type="primary" size="mini" round>
                {{ item }} <i class="el-icon-close el-icon--right" @click="delPoint(index)" />
              </el-button>
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="clear-float" />
      <el-form-item label="题目：" required>
        <quill-editor
          v-model="tm.title"
          :options="editorOption"
        />
        <div>（这里填写题目描述）</div>
      </el-form-item>
      <el-form-item label="添加小题：" prop="children">
        <el-select v-model="childrenType" placeholder="请选择题型" size="mini" clearable class="w-300" @change="choseSmallTm">
          <!--eslint-disable-next-line-->
          <el-option v-for="(item,index) in tiMuTypeList" :key="index" :label="item" :value="parseInt(index)" v-if="index < 6" />
        </el-select>
      </el-form-item>
      <el-form-item label="小题预览：">
        <div class="smallTmWatch">
          <el-table
            ref="table"
            size="mini"
            :data="tmSmall"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column type="index" width="50" align="center" />
            <el-table-column label="题型" prop="type" width="" align="center">
              <template slot-scope="{ row }">{{ tiMuTypeList[row['type']] }}</template>
            </el-table-column>
            <el-table-column label="题目" :show-overflow-tooltip="true" align="center">
              <template slot-scope="{row}">
                <span v-html="row.title" />
              </template>
            </el-table-column>
            <el-table-column label="答案" :show-overflow-tooltip="true" align="">
              <template slot-scope="{row}">
                <span v-if="row['type'] === timuType.PAN_DUAN">{{ row['answer'].join(',') === 'A'?'正确':'错误' }}</span>
                <span v-else class="flex"><span class="flex" v-html="row['answer'].join(',')" /></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{ row, column, $index }">
                <el-popover placement="bottom-end" width="400" trigger="click">
                  <div class="p-5" v-html="row.title" />
                  <div v-if="row['options']">
                    <div v-for="(item, index) in row['options']" :key="index">
                      <div class="flex flex-align-center p-5"><span>{{ optionNumberToLetter[index + 1] }}、</span><span v-html="item" /></div>
                    </div>
                  </div>
                  <div v-if="row['answer']" class="p-5 flex">正确答案：
                    <span v-if="row['type'] === timuType.PAN_DUAN">{{ row['answer'].join(',') === 'A'?'正确':'错误' }}</span>
                    <span v-else class="flex"><span v-html="row['answer'].join(',')" /></span>
                  </div>
                  <div v-if="row['parse']" class="p-5 flex"><span style="width: 60px">解析：</span><span v-html="row['parse']" /></div>
                  <el-button slot="reference" type="text" size="mini">预览</el-button>
                </el-popover>
                <el-button type="text" size="mini" style="margin-left: 12px" @click="handleSmallTmEdit(row, column, $index)">
                  编辑
                </el-button>
                <el-button type="text" size="mini" @click="handleSmallTmDel(row.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" block :loading="submitLoading" @click="submitForm('form')">保存试题</el-button>
        <el-button plain size="small" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
    <!--知识点弹窗-->
    <el-dialog v-el-drag-dialog width="600px" :modal="false" :close-on-click-modal="false" title="添加知识点" :visible.sync="dialogVisible" @dragDialog="handleDrag">
      <div ref="div" class="mb-12">
        <el-input v-model="pageQuery.knowledge_point" size="mini" placeholder="请输入知识点关键词" class="w-300">
          <el-button slot="append" icon="el-icon-search" @click="getPointList" />
        </el-input>
      </div>
      <div style="max-height: 350px; overflow-y: auto">
        <el-table
          ref="pointTable"
          size="mini"
          :data="pointList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @select="selectRows"
          @select-all="selectAllRows"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column label="知识点" prop="knowledge_point" align="center" />
        </el-table>
      </div>
      <pagination v-show="total>0" layout="prev, pager, next" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getPointList" />

      <div ref="divPwd" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="savePoint">
          保存
        </el-button>
        <el-button size="small" plain @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!--小题弹窗-->
    <!--    <div v-if="dialogTmVisible">-->
    <el-dialog v-el-drag-dialog width="750px" class="smallTm" :modal="false" :close-on-click-modal="false" title="添加小题" :before-close="resetType" :visible.sync="dialogTmVisible" @dragDialog="handleTmDrag">
      <div ref="tmDiv" class="tmDiv">
        <SmallTm :type="childrenType.toString()" :tm-small-index="tmSmallIndex" @resetType="resetType" />
      </div>
    </el-dialog>
    <!--    </div>-->
  </div>
</template>

<script>
import { fetchListPoint, fetchListLevelSet, handleZuHeAdd } from '@/api/objKu'
import { mapGetters } from 'vuex'
// import uploadVideo from '@/mixins/upload-video'
import { Quill } from 'vue-quill-editor'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination'
import SmallTm from './SmallTm'

Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'Zuhe',
  components: { SmallTm, Pagination },
  directives: { waves, elDragDialog },
  props: {
    tiMuData: {
      type: Object,
      required: true,
      defaults: {}
    },
    tiMuTypeList: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  // mixins: [uploadVideo],
  data() {
    return {
      tm: {
        children: [
          { type: '' }
        ]
      },
      childrenType: '',
      pointStr: '', // todo
      pointArr: [], // todo
      pointIdArr: [], // todo
      rules: {
        difficulty_id: [
          { required: true, message: '请选择 难度', trigger: 'change' }
        ]
      },
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 1, // 单位为M, 1M = 1024KB
            action: window.host + 'uploadEditorImg',
            response: (res) => {
              if (res.status === 1) {
                return res.resultData
              } else {
                this.$message.error(res.info)
              }
            },
            sizeError: () => {
              this.$message.error('图片尺寸最大为1M')
            },
            // 可选参数 设置请求头部
            headers: (xhr) => {
              xhr.setRequestHeader('token', this.$store.state.access_token_teacher)
            }
          },
          toolbar: {
            container: ['bold', 'italic', 'underline', { 'script': 'sub' }, { 'script': 'super' }, 'clean', 'image'],
            handlers: {
              'image': function() {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        },
        placeholder: ''
      },
      dialogVisible: false,
      levelList: [], // 难度列表
      pointList: [], // 知识点列表
      total: 20,
      listQuery: {
        knowledge_point: ''
      },
      pageQuery: {
        page: 1,
        limit: 20
      },
      checkedPoint: [],
      submitLoading: false,
      dialogTmVisible: false,
      tmSmallIndex: ''
    }
  },
  computed: {
    ...mapGetters(['timuType', 'optionNumberToLetter', 'tmSmall'])
  },
  created() {
    this.initData()
    this.getLevelList() // 取难易度
  },
  methods: {
    initData() {
      if (this.tiMuData.title) {
        const dataPoint = []
        if (this.tiMuData.knowledge_points && Array.isArray(this.tiMuData.knowledge_points)) {
          this.tiMuData.knowledge_points.forEach(v => {
            dataPoint.push(v.id)
            this.pointArr.push(v.knowledge_point)
            this.pointIdArr.push(v.id)
          })
        }
        this.tm = {
          id: this.tiMuData.id,
          type: this.tiMuData.type,
          difficulty_id: this.tiMuData.difficulty_id,
          title: this.tiMuData.title,
          knowledge_point_id: dataPoint,
          children: this.tiMuData.children,
          keywords: this.tiMuData.keywords
        }
        // 处理成需要的格式
        const resultData = []
        const children = this.tiMuData.children
        if (children && children.length > 0) {
          children.forEach(child => {
            resultData.push({
              type: child.type,
              title: child.title,
              answer: child.ext.answer,
              parse: child.ext.parse,
              options: child.ext.options,
              keywords: child.ext.keywords
            })
          })
        }
        this.$store.commit('tm/SAVE_TM', resultData)
      } else {
        this.tm = {
          type: this.$store.getters.timuType.ZU_HE,
          difficulty_id: 1,
          title: '',
          knowledge_point_id: [],
          children: [],
          keywords: ''
        }
      }
    },
    // 获取难易度列表
    getLevelList() {
      fetchListLevelSet().then(response => {
        this.levelList = response.data.data
      })
    },
    resetTmForm() {
      this.tm = {
        type: this.$store.getters.timuType.ZU_HE,
        difficulty_id: 1,
        title: '',
        knowledge_point_id: [],
        children: []
      }
    },
    // 删除知识点
    delPoint(index) {
      this.pointArr.splice(index, 1)
      this.pointIdArr.splice(index, 1)
    },
    // 添加知识点弹窗
    handleCreatePoint() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.getPointList()
      })
    },
    // 获取知识点列表数据
    getPointList() {
      fetchListPoint(this.listQuery, this.pageQuery).then(response => {
        this.pointList = response.data.data
        this.total = response.data.total
        this.recoverSelect()
      })
    },
    recoverSelect() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.pointTable.clearSelection()
        }, 50)
        if (this.pointList && this.pointList.length > 0) {
          this.pointList.forEach(v => {
            if (this.pointIdArr.indexOf(v.id) > -1) {
              setTimeout(() => {
                this.$refs.pointTable.toggleRowSelection(v)
              }, 100)
            }
          })
        }
      })
    },
    // 选中单个知识点
    selectRows(selection, row) {
      const selected = selection.length && selection.indexOf(row) !== -1
      if (selected) {
        // 选中的时候没有，填进去
        if (this.pointIdArr.indexOf(row.id) === -1) {
          this.pointIdArr.push(row.id)
          this.pointArr.push(row.knowledge_point)
        }
      } else {
        // 取消选中, 如果有，踢出来
        const indexId = this.pointIdArr.indexOf(row.id)
        if (indexId > -1) {
          this.pointIdArr.splice(indexId, 1)
          this.pointArr.splice(indexId, 1)
        }
      }
    },
    // 全部选中知识点
    selectAllRows(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.pointList.forEach(value => {
          const indexId = this.pointIdArr.indexOf(value.id)
          if (indexId > -1) {
            this.pointIdArr.splice(indexId, 1)
            this.pointArr.splice(indexId, 1)
          }
        })
      } else {
        // 全选
        this.pointList.forEach(value => {
          if (this.pointIdArr.indexOf(value.id) === -1) {
            this.pointIdArr.push(value.id)
            this.pointArr.push(value.knowledge_point)
          }
        })
      }
    },
    // 保存知识点
    savePoint() {
      this.dialogVisible = false
    },
    submitForm(formName) {
      if (this.tm.title === '') {
        this.$message.error('请填写题目')
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tm.knowledge_point_id = this.pointIdArr
            this.tm.children = this.tmSmall
            handleZuHeAdd(this.tm).then(response => {
              if (this.tm.id) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('新增成功')
              }
              this.$store.commit('tm/SAVE_TM', [])
            })
          }
        })
      }
    },
    // dialog拖拽
    handleDrag() {
      this.$refs.div.blur()
    },
    goBack() {
      this.$router.go(-1)
    },
    handleTmDrag() {
      this.$refs.tmDiv.blur()
    },
    // 选择小题类型
    choseSmallTm() {
      if (this.childrenType !== '') {
        this.tmSmallIndex = ''
        this.dialogTmVisible = true
      }
    },
    // 编辑
    handleSmallTmEdit(row, column, index) {
      this.childrenType = row.type
      this.tmSmallIndex = index.toString()
      this.dialogTmVisible = true
    },
    // 还原选中题目类型
    resetType() {
      this.childrenType = ''
      this.dialogTmVisible = false
      console.log(this.tm)
    },
    // 删除
    handleSmallTmDel(index) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.tmSmall.splice(index, 1)) {
          this.$message.success('删除成功')
        }
      }).catch(() => {
        console.log('cancel')
      })
    }
  }
}
</script>
<style>
  .zuhe .smallTm .el-dialog__body{
    padding: 0;
  }
</style>
<style lang="scss" scoped>
  .zuhe {
    .point-div{
      border: solid 1px #DCDFE6;
      padding: 5px;
      min-height: 50px;
      max-height: 100px;
      overflow-y: auto;
    }
    .tmDiv{
      height: 600px;
      overflow-y: auto;
    }
  }
</style>
