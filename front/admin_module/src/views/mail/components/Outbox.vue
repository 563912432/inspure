<template>
  <div class="outbox">
    <div class="mb-12 text-right">
      <!--      <el-button plain size="mini" @click="setMailRead">-->
      <!--        标为已读-->
      <!--      </el-button>-->
      <el-button type="primary" size="mini" @click="writeMail">
        写信
      </el-button>
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
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="发送时间" width="" prop="time" align="center">
          <template slot-scope="{row}">
            {{ row.created_at }}
          </template>
        </el-table-column>
        <el-table-column label="收信人" width="" prop="to_id" align="center" />
        <el-table-column label="主题" width="" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="delMail(row)">
              {{ row.message.message }}
            </el-button>
          </template>
        </el-table-column>
        <!--        <el-table-column label="内容摘要" width="" :show-overflow-tooltip="true" prop="brief" align="">-->
        <!--          <template slot-scope="{row}">-->
        <!--            {{ row.message.content }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
    </div>
    <!--分页-->
    <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchListOutBox } from '@/api/mail'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Outbox',
  components: { Pagination },
  data() {
    return {
      total: 10,
      listLoading: false,
      pageQuery: {
        page: 1,
        page_size: 10
      },
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    setMailRead() {},
    writeMail() {
      this.$router.push('/mail/setMail')
    },
    // 查看详情
    delMail(row) {
      this.$store.commit('msg/SAVE_MESSAGE', row['message'])
      this.$router.push(`/mail/setMail/${row.msg_id}`)
    },
    getList() {
      this.listLoading = true
      fetchListOutBox(this.pageQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
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
