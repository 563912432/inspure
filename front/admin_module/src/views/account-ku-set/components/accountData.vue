<template>
  <div class="AccountData">
    <!--    <div class="text-right">-->
    <!--      <el-button size="small" type="primary">进入系统</el-button>-->
    <!--    </div>-->
    <el-table
      class="mt-10"
      size="mini"
      :data="resultData"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="月份" width="" prop="month" align="center" />
      <el-table-column label="工资表" width="" prop="" align="">
        <template slot-scope="{ row, column, $index }">
          <span v-if="row.gongZiFile">
            <el-button size="mini" plain>
              {{ row.gongZiFile }} <i class="el-icon-close el-icon--right" @click="delGongZi($index)" />
            </el-button>
          </span>
          <span v-else>
            <span><el-button type="text" size="small" @click="addGongZi($index)">新增文件</el-button></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="银行流水" width="" prop="" align="">
        <template slot-scope="{ row, column, $index }">
          <span v-if="row.liuShuiFile">
            <el-button size="mini" plain>
              {{ row.liuShuiFile }} <i class="el-icon-close el-icon--right" @click="delLiuShui($index)" />
            </el-button>
          </span>
          <span v-else>
            <span><el-button type="text" size="small" @click="addLiuShui($index)">新增文件</el-button></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="" prop="" align="center">
        <template slot-scope="{ row, column, $index }">
          <el-button v-if="row.enable" type="text" size="small" @click="addMonth">新增月份</el-button>
          <el-button v-if="row.enable && $index > 0" type="text" size="small" @click="delMonth($index)">删除月份</el-button>
        </template>
      </el-table-column>
      <el-table-column label="进入系统" width="" prop="" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" plain @click="toSystem(row)">进入系统</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-10">
      <el-button type="primary" size="small" @click="back">
        上一步
      </el-button>
      <el-button type="primary" size="small" @click="next">
        下一步
      </el-button>
    </div>
    <!--上传弹窗-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="上传文件"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      width="400px"
      center
      @dragDialog="handleDrag"
    >
      <el-alert
        :closable="false"
        title="上传须知"
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
  name: 'AccountData',
  directives: { elDragDialog },
  data() {
    return {
      resultData: [],
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
      // 总线上如果有月份，取月份；没有的话顺延
      const accountAnswer = this.$store.getters.accountAnswer.accountData
      if (accountAnswer.length > 0) {
        accountAnswer.forEach(v => {
          this.resultData.push({ month: v.month, gongZiFile: v.gongZiFile, gongZiUrl: v.gongZiUrl, liuShuiFile: v.liuShuiFile, liuShuiUrl: v.liuShuiUrl, enable: 1 })
        })
      } else {
        let enable_date = this.$store.state.account.currentAccountData['enable_date']
        // 拆成日期字符串格式
        enable_date = enable_date.substring(0, 4) + '-' + enable_date.substring(4, 6)
        this.resultData.push({ month: enable_date, gongZiFile: '', gongZiUrl: '', liuShuiFile: '', liuShuiUrl: '', enable: 1 })
      }
    },
    addGongZi(index) {
      this.importDialogVisible = true
    },
    delGongZi(index) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resultData[index]['gongZiFile'] = ''
        this.resultData[index]['gongZiUrl'] = ''
      }).catch(() => {
        console.log('cancel')
      })
    },
    addLiuShui(index) {
      this.importDialogVisible = true
    },
    delLiuShui(index) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resultData[index]['liuShuiFile'] = ''
        this.resultData[index]['liuShuiUrl'] = ''
      }).catch(() => {
        console.log('cancel')
      })
    },
    addMonth() {
      let date = this.resultData[this.resultData.length - 1]['month']
      date = new Date(date)
      date.setMonth(date.getMonth() + 1)
      date = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)
      this.resultData.push({ month: date, gongZiFile: '', gongZiUrl: '', liuShuiFile: '', liuShuiUrl: '', enable: 1 })
    },
    delMonth(index) {
      if (this.resultData.length > 1) {
        this.resultData.splice(index, 1)
      }
    },
    handleDrag() {
      this.$refs['importDiv'].blur()
    },
    back() {
      this.$emit('back')
    },
    next() {
      this.$store.commit('account/SAVE_ACCOUNT_DATA', this.resultData)
      // this.$message.success('保存成功')
      console.log(this.$store.getters.accountAnswer)
      this.$emit('next')
    },
    // 进入系统操作
    toSystem(row) {
      // 取token
      const url = this.$router.resolve('/EYunIndex')
      window.open(url.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
  .AccountData{
    padding-top: 12px;
  }
</style>
