<style>
  .panduan {
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
  <div class="panduan p-20">
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
      <el-form-item label="正确答案：" prop="answer" required>
        <el-radio-group v-model="tm.answer">
          <el-radio label="A" border>正确</el-radio>
          <el-radio label="B" border>错误</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文字解析：" required>
        <quill-editor
          v-model="tm.parse"
          :options="editorOption"
        />
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
  </div>
</template>

<script>
import { fetchListPoint, fetchListLevelSet, saveTm } from '@/api/objKu'
import { mapGetters } from 'vuex'
// import uploadVideo from '@/mixins/upload-video'
import { Quill } from 'vue-quill-editor'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'Panduan',
  components: { Pagination },
  directives: { waves, elDragDialog },
  props: {
    tiMuData: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  // mixins: [uploadVideo],
  data() {
    return {
      tm: {},
      pointStr: '', // todo
      pointArr: [], // todo
      pointIdArr: [], // todo
      rules: {
        difficulty_id: [
          { required: true, message: '请选择 难度', trigger: 'change' }
        ],
        answer: [
          { required: true, message: '正确答案 不得为空', trigger: 'change' }
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
      submitLoading: false
    }
  },
  computed: {
    ...mapGetters(['timuType', 'optionNumberToLetter'])
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
          answer: this.tiMuData.ext.answer.join(','),
          parse: this.tiMuData.ext.parse,
          knowledge_point_id: dataPoint
        }
      } else {
        this.tm = {
          type: this.$store.getters.timuType.PAN_DUAN,
          difficulty_id: 1,
          title: '',
          answer: [],
          parse: '',
          knowledge_point_id: []
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
        type: this.$store.getters.timuType.PAN_DUAN,
        difficulty_id: 1,
        title: '',
        answer: '',
        parse: '',
        knowledge_point_id: []
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
            this.submitLoading = true
            this.tm.answer = this.tm.answer.split()
            this.tm.knowledge_point_id = this.pointIdArr
            saveTm(this.tm).then(response => {
              this.submitLoading = false
              if (this.tm.id) {
                this.$message.success('编辑成功')
                this.tm.answer = this.tm.answer.join(',')
              } else {
                this.$message.success('添加成功')
                this.resetTmForm()
                this.$refs[formName].resetFields()
                this.pointIdArr = []
                this.pointArr = []
              }
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .point-div{
    border: solid 1px #DCDFE6;
    padding: 5px;
    min-height: 50px;
    max-height: 100px;
    overflow-y: auto;
  }
</style>
