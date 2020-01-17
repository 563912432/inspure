<template>
  <div class="courseType">
    <div class="mb-12 mt-12 text-right">
      <!--<span class="filter-container">
        <el-input v-model="listQuery.course_cate" size="mini" clearable placeholder="请输入课程分类名称" class="mr-20 w-300">
          <el-button slot="append" icon="el-icon-search" @click="getList" />
        </el-input>
      </span>-->
      <span>
        <el-button size="small" type="primary" @click="handleAdd">
          新增课程分类
        </el-button>
        <el-button size="small" plain @click="handleImport">
          导入
        </el-button>
        <el-button size="small" plain @click="handleDel">
          批量删除
        </el-button>
      </span>
    </div>
    <div class="bg-white">
      <el-table
        v-loading="listLoading"
        class="mb-12"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <!--<el-table-column label="编号" type="index" width="100" align="center" />-->
        <el-table-column label="编号" prop="num" width="100" align="center" />
        <el-table-column label="课程分类" prop="title" width="" align="" show-overflow-tooltip />
        <el-table-column label="启用状态" width="220" align="center">
          <template slot-scope="{row}">
            <el-tooltip :content="row.enable?'开启': '关闭'" placement="top">
              <el-switch
                v-model="row.enable"
                active-color="#55A625"
                inactive-color="#999999"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus(row.id, row.enable)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="courseTypeEdit(row)">编辑</el-button>
            <el-button type="text" size="mini" @click="courseTypeDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getList" />
    </div>
    <!--课程弹窗-->
    <el-dialog v-el-drag-dialog class="knowledge-cate-dialog" width="400px" :modal="false" :close-on-click-modal="false" :title="textMap[cateStatus]" :visible.sync="dialogCateVisible" @dragDialog="handleCateDrag">
      <el-form ref="cateForm" :rules="cateRules" :model="cateFormData" label-position="left" label-width="115px">
        <el-form-item label="课程分类名称" prop="course_cate">
          <el-input v-model="cateFormData.title" clearable size="mini" />
        </el-form-item>
      </el-form>
      <div ref="divCate" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveCate('cateForm')">
          确定
        </el-button>
        <el-button size="small" plain @click="dialogCateVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
    <!--上传弹窗-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="批量导入"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      width="400px"
      center
      :before-close="closeImportDialog"
      @dragDialog="handleDrag"
    >
      <el-alert
        :closable="false"
        title="导入须知"
        type="success"
        class="mb-20"
      >
        <div ref="div" class="f14 p-5">
          <div slot="tip" class="small mt-10" style="line-height: 20px">文件大小不得超过5M，请先点击下载
            <a
              class="c-orange"
              :href="host + '@/assets/xls/pointExample.xls'"
              target="_blank"
            >示例文档</a>，按照示例文档填写后上传
          </div>
        </div>
      </el-alert>
      <el-form
        ref="importForm"
        :model="importForm"
        :rules="importFormRules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="上传文件" prop="file">
          <el-upload
            ref="upload"
            :limit="1"
            class="upload-demo"
            :action="host + 'batchUploadStudentDocument'"
            :data="importForm"
            :headers="headers"
            :before-upload="beforeUploadDocument"
            :on-success="handleUploadFileSuccess"
            :on-error="handleUploadFileError"
            :show-file-list="true"
            :auto-upload="true"
          >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchListCate, addCate, delCate } from '@/api/objKu'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CourseType',
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        course_cate: ''
      },
      pageQuery: {
        page: 1,
        limit: 10
      },
      multipleSelection: [],
      importDialogVisible: false,
      importForm: {},
      importFormRules: {},
      submitData: {},
      cateFormData: {
        course_cate: ''
      },
      dialogCateVisible: false,
      cateRules: {
        course_cate: [{ required: true, message: '课程分类必须填写', trigger: 'blur' }]
      },
      textMap: {
        'create': '新增课程分类',
        'update': '编辑课程分类'
      },
      cateStatus: ''
    }
  },
  computed: {
    host() {
      return window.host
    },
    headers() {
      return {
        token: this.$store.state.access_token_teacher
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      /* fetchListCate(this.listQuery, this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }) */
      this.list = [
        { num: '01', title: '基础会计', enable: 0 },
        { num: '02', title: '财务会计', enable: 1 },
        { num: '03', title: '成本会计', enable: 0 },
        { num: '04', title: '财务会计', enable: 1 },
        { num: '05', title: '管理会计', enable: 0 }
      ]
      this.total = this.list.length
      this.listLoading = false
    },
    // 新增课程分类
    handleAdd() {
      this.cateFormData = {
        course_cate: ''
      }
      this.cateStatus = 'create'
      this.dialogCateVisible = true
      this.$nextTick(() => {
        this.$refs['cateForm'].clearValidate()
      })
    },
    // 编辑课程分类
    courseTypeEdit(row) {
      this.cateFormData = Object.assign({}, row) // 复制对象
      this.cateStatus = 'update'
      this.dialogCateVisible = true
      this.$nextTick(() => {
        this.$refs['cateForm'].clearValidate()
      })
    },
    // 删除单条
    courseTypeDel(id) {
      this.$confirm('确定要删除当前课程分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /* delCate({ id: id }).then(response => {
          this.$message.success('删除成功')
          this.getList()
        })*/
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 批量删除
    handleDel() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /* let tmpString = ''
          for (const i in this.multipleSelection) {
            tmpString += this.multipleSelection[i].id + ','
          }
          tmpString = tmpString.substring(0, tmpString.lastIndexOf(','))
          delCate({ id: tmpString }).then((response) => {
            this.$message.success('删除成功')
            this.getList()
          })*/
        }).catch(() => {
          console.log('cancel')
        })
      } else {
        this.$message({
          message: '请选择要删除的选项',
          type: 'warning',
          duration: 2000
        })
      }
    },
    // 保存课程分类
    saveCate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /* addCate(this.cateFormData).then(response => {
            let message = ''
            if (this.cateFormData.id) {
              message = '编辑成功'
            } else {
              message = '新增成功'
            }
            this.$message.success(message)
            this.dialogCateVisible = false
            this.getList()
          })*/
        }
      })
    },
    // 导入
    handleImport() {
      this.importDialogVisible = true
    },
    // checkbox的多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 上传弹窗之前，清空form
    closeImportDialog() {
      this.importForm = {}
      this.importDialogVisible = false
    },
    beforeUploadDocument(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // 验证单次文件上传大小 不能超过5M
      if (!isLt5M) {
        this.$message.error('文件大小不得超过5M')
        return false
      }
    },
    handleUploadFileSuccess(res, file) {
      if (res.status === 1) {
        this.$message.success('课程分类批量导入成功')
        this.closeImportDialog()
        this.getList(null)
      } else {
        this.$refs.upload.clearFiles()
        this.$message.error(res.info)
      }
    },
    handleUploadFileError() {
      this.$refs.upload.clearFiles()
      this.$message.error('批量导入失败')
    },
    handleDrag() {
      this.$refs.div.blur()
    },
    handleCateDrag() {
      this.$refs.divCate.blur()
    },
    changeStatus() {}
  }
}
</script>

<style scoped>

</style>
