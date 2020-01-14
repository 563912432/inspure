<template>
  <div class="inbox">
    <div class="text-right mb-12">
      <el-button plain size="mini" @click="setMailRead">
        标为已读
      </el-button>
      <!--      <el-button type="primary" size="mini" @click="writeMail">-->
      <!--        写信-->
      <!--      </el-button>-->
    </div>
    <div class="box-shadow">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="发送时间" width="150" prop="time" align="center">
          <template slot-scope="{row}">
            {{ row.created_at }}
          </template>
        </el-table-column>
        <el-table-column label="发信人" width="90" prop="from_id" align="center" />
        <el-table-column label="主题" width="200" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="delMail(row.msg_id)">
              {{ row.message? row.message.message: '' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="内容摘要" width="" :show-overflow-tooltip="true" prop="brief" align="">
          <template slot-scope="{row}">
            {{ row.message? row.message.content: '' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" width="100" align="center">
          <template slot-scope="{row}">
            {{ row.state? '已读': '未读' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="delMail(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <pagination v-show="total>0" class="text-center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchListInBox, handleRead } from '@/api/mail'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Inbox',
  components: { Pagination },
  data() {
    return {
      total: 10,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 10
      },
      list: [],
      selectIds: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 未读变已读
    setMailRead() {
      if (this.selectIds === '') {
        this.$message.warning('请选择要操作的信息')
      } else {
        handleRead({ id: this.selectIds, state: 1 }).then(response => {
          this.$message.success(response.msg)
          this.getList()
        })
      }
    },
    writeMail() {
      this.$router.push('/mail/setMail')
    },
    // 查看单条信息的详情
    delMail(msgId) {
      this.$router.push(`/mail/setMail/${msgId}`)
    },
    getList() {
      this.listLoading = true
      fetchListInBox(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(value) {
      if (value.length > 0) {
        value.forEach(v => {
          this.selectIds = v.id + ','
        })
        this.selectIds = this.selectIds.substring(0, this.selectIds.length - 1)
      }
    },
    timeStampToSting(timeStamp) {
      const d = new Date(timeStamp * 1000) // 根据时间戳生成的时间对象
      const year = d.getFullYear()
      let month = d.getMonth() + 1
      if (month < 10) month = '0' + month
      let day = d.getDate()
      if (day < 10) day = '0' + day
      let hours = d.getHours()
      if (hours < 10) hours = '0' + hours
      let minutes = d.getMinutes()
      if (minutes < 10) minutes = '0' + minutes
      let seconds = d.getSeconds()
      if (seconds < 10) seconds = '0' + seconds
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
  }
}
</script>

<style scoped>

</style>
