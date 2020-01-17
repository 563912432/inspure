<template>
  <div class="levelSet">
    <div class="text-right mb-12 pr-5 mt-12">
      <el-button size="mini" type="primary" @click="handleImport">
        导入
      </el-button>
      <el-button size="mini" plain @click="handleDel">
        批量删除
      </el-button>
    </div>
    <div class="box-shadow bg-white pb-20">
      <el-table
        v-loading="listLoading"
        class="mb-10"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="编号" type="index" width="100" align="center" />
        <el-table-column label="难易度" width="" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.difficulty" size="mini" />
            </template>
            <span v-else>{{ row.difficulty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px" align="center">
          <template slot-scope="{row}">
            <el-button v-if="row.edit" type="text" size="mini" @click="saveEdit(row)">保存</el-button>
            <el-button v-if="row.edit" type="text" size="mini" @click="row.edit = false">取消</el-button>
            <el-button v-else type="text" size="mini" @click="row.edit = true">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDelOne(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
              :href="host + '@/assets/xls/pointLevel.xls'"
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
import { fetchListLevelSet, handleAddLevelSet, handleDelLevelSet } from '@/api/objKu'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import waves from '@/directive/waves' // waves directive
export default {
  name: 'LevelSet',
  directives: { waves, elDragDialog },
  data() {
    return {
      listLoading: false,
      list: null,
      multipleSelection: [],
      importDialogVisible: false,
      importForm: {},
      importFormRules: {}
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
      fetchListLevelSet().then(response => {
        this.list = response.data.data
        this.total = response.data.total
        // 添个字段判断是否处于编辑的状态中
        this.list.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.list.push({
          difficulty: '',
          edit: true
        })
        this.listLoading = false
      })
    },
    // 保存编辑信息
    saveEdit(row) {
      if (row.difficulty === '') {
        this.$message.warning('请填写难易度')
      } else {
        let data = {}
        let message = ''
        if (row.id === undefined || row.id === null) {
          // 新增
          data = { difficulty: row.difficulty }
          message = '新增成功'
        } else {
          // 编辑
          data = { id: row.id, difficulty: row.difficulty }
          message = '编辑成功'
        }
        handleAddLevelSet(data).then(response => {
          this.$message.success(message)
          this.getList()
        })
      }
    },
    // 单条删除
    handleDelOne(id) {
      if (id !== undefined) {
        this.$confirm('确定要删除当前难易度吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleDelLevelSet({ id: id }).then(response => {
            this.$message.success('删除成功')
            this.getList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 批量删除
    handleDel() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tmpString = ''
          for (const i in this.multipleSelection) {
            tmpString += this.multipleSelection[i].id + ','
          }
          tmpString = tmpString.substring(0, tmpString.lastIndexOf(','))
          handleDelLevelSet({ id: tmpString }).then((response) => {
            this.$message.success('删除成功')
            this.getList()
          })
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
    // checkbox的多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导入
    handleImport() {
      this.importDialogVisible = true
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
        this.$message.success('知识点批量导入成功')
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
    }
  }
}
</script>

<style scoped>

</style>
