<style>
  .uploadImageText {
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
  <div class="uploadImageText">
    <div class="f-15" style="margin-bottom: 10px"><el-tag type="info">本地文件</el-tag></div>
    <div>
      <el-form ref="form" :model="uploadForm" :rules="uploadRule" label-width="110px">
        <el-form-item label="所属课程目录" prop="cate">
          <el-select v-model="uploadForm.cate" placeholder="请选择课程目录">
            <el-option label="初级会计" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="金币" prop="gold">
          <el-select v-model="uploadForm.gold" placeholder="请选择金币">
            <el-option label="中职" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识点：" class="flex-1" required>
          <div class="w-100p">
            <div><el-button type="primary" size="small" @click="handleCreatePoint">添加</el-button></div>
            <div class="point-div" style="">
              <el-button v-for="(item, index) in pointArr" :key="index" type="primary" size="mini" round>
                {{ item }} <i class="el-icon-close el-icon--right" @click="delPoint(index)" />
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="学习要求" prop="requirement">
          <el-input v-model="uploadForm.requirement" type="textarea" />
        </el-form-item>
        <el-form-item label="视频设置">
          <el-checkbox v-model="checked">允许学生拖动进度条</el-checkbox>
        </el-form-item>
        <el-form-item label="所属类型" prop="type">
          <el-radio-group v-model="uploadForm.type">
            <el-radio :label="1">任务点</el-radio>
            <el-radio :label="2">拓展资源</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-radio-group v-model="uploadForm.purpose">
            <el-radio :label="1">未指定</el-radio>
            <el-radio :label="2">课前</el-radio>
            <el-radio :label="3">课中</el-radio>
            <el-radio :label="4">课后</el-radio>
            <el-radio :label="5">期中</el-radio>
            <el-radio :label="6">期末</el-radio>
            <el-radio :label="7">实践</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传图文">
          <quill-editor
            v-model="uploadForm.content"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
import { fetchListPoint } from '@/api/objKu'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Quill } from 'vue-quill-editor'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'

Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'UploadImageText',
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
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
      checked: true,
      uploadForm: {
        cate: '',
        gold: '',
        requirement: '',
        type: '',
        progress: []
      },
      uploadRule: {
        cate: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
        gold: [{ required: true, message: '请选择金币', trigger: 'change' }]
      },
      dialogVisible: false,
      listQuery: {
        knowledge_point: ''
      },
      pageQuery: {
        page: 1,
        limit: 20
      },
      total: 0,
      pointList: [], // 知识点列表
      pointArr: [], // todo
      content: '',
      pointIdArr: [] // todo
    }
  },
  methods: {
    onSubmit() {},
    cancel() {
      this.$emit('click')
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
    // 删除知识点
    delPoint(index) {
      this.pointArr.splice(index, 1)
      this.pointIdArr.splice(index, 1)
    },
    // dialog拖拽
    handleDrag() {
      this.$refs.div.blur()
    }
  }
}
</script>

<style scoped lang="scss">
  .uploadImageText{
    .point-div{
      border: solid 1px #DCDFE6;
      padding: 5px;
      min-height: 50px;
      max-height: 100px;
      overflow-y: auto;
    }
  }
</style>
