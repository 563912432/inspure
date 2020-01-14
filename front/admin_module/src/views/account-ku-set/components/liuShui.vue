<template>
  <div class="LiuShui">
    <el-table
      size="mini"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="月份" width="" align="center" prop="month" />
      <el-table-column label="操作" width="" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.file !== ''" size="mini" type="primary" @click="delFile(row.month)">删除文件</el-button>
          <el-button v-else size="mini" type="primary" @click="addFile(row.month)">添加文件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="月份" width="" align="center">
        <template slot-scope="{ row }">
          <a v-if="row.file !== ''" :href="row.url">{{ row.file }}</a>
        </template>
      </el-table-column>
    </el-table>
    <!--上传弹窗-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="批量导入"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      width="400px"
      center
      @dragDialog="handleDrag"
    >
      <el-alert
        :closable="false"
        title="导入须知"
        type="success"
        class="mb-20"
      >
        <div ref="importDiv" class="f14 p-5">
          <div slot="tip" class="small mt-10" style="line-height: 20px">文件大小不得超过5M，请先点击下载
            <a
              class="c-orange"
              :href="'@/assets/xls/pointExample.xls'"
              target="_blank"
            >示例文档</a>，按照示例文档填写后上传
          </div>
        </div>
      </el-alert>
      <el-form
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
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'LiuShui',
  directives: { elDragDialog },
  data() {
    return {
      monthData: [],
      tableData: [],
      importDialogVisible: false
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
      if (this.accountAnswer.month && this.accountAnswer.month.length > 0) {
        this.monthData = this.accountAnswer.month // 取总线上的月份
        this.tableData = this.accountAnswer.liuShui
      } else {
        this.$message.warning('请先维护月份')
        this.$emit('changeState', this.$store.getters.addAccountKuType.Month)
      }
    },
    addFile(month) {
      this.importDialogVisible = true
    },
    delFile(month) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleDrag() {
      this.$refs['importDiv'].blur()
    }
  }
}
</script>

<style lang="scss" scoped>
  .LiuShui{
    padding: 10px 0 10px 10px;
  }
</style>
