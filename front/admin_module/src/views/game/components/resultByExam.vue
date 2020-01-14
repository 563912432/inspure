<template>
  <div class="resultByExam bg-white box-shadow">
    <div class="title">选择比赛</div>
    <div class="filter-container">
      <el-input v-model="listQuery.title" size="mini" clearable placeholder="请输入比赛名称" class="w-190 mr-20">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-input v-model="listQuery.exam_title" size="mini" clearable placeholder="请输入考试名称" class="w-190 mr-20">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-date-picker
        v-model="listQuery.at"
        size="mini"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        clearable
        end-placeholder="结束日期"
        @change="getList"
      />
    </div>
    <div class="table-content">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @current-change="chosePaper"
      >
        <el-table-column label="考试名称" width="" prop="examName" align="center" />
        <el-table-column label="分类" width="" prop="examType" align="center" />
        <el-table-column label="总分" width="60" prop="score" align="center" />
        <el-table-column label="开始时间" width="140" prop="startTime" align="center" />
        <el-table-column label="结束时间" width="140" prop="endTime" align="center" />
        <el-table-column label="创建人" prop="creator" width="70" align="center" />
        <el-table-column label="创建时间" width="140" prop="createTime" align="center" />
      </el-table>
    </div>
    <pagination v-show="total>0" class="text-center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <div class="h-30 text-right">
      <el-button size="mini" class="mr-20" type="primary" @click="searchPaper">确定</el-button>
    </div>
  </div>
</template>

<script>
// import { fetchList } from '@/api/auto-exam'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ResultByExam',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        title: '',
        exam_title: '',
        at: [],
        page: 1,
        limit: 10
      },
      listLoading: false,
      list: [],
      total: 0,
      currentRow: '' // 选中行
    }
  },
  computed: {
    examTypeList() {
      return this.$store.getters.examTypeList
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var att = [
        {
          id: 1,
          examName: '初级A',
          examType: '初级',
          score: '100',
          startTime: '2019-10-5 08:00:00',
          endTime: '2019-10-5 16:00:00',
          creator: '朱士虎',
          createTime: '2019-10-15 16:00:00'
        },
        {
          id: 2,
          examName: '初级A',
          examType: '初级',
          score: '100',
          startTime: '2019-10-5 08:00:00',
          endTime: '2019-10-5 16:00:00',
          creator: '朱士虎',
          createTime: '2019-10-15 16:00:00'
        },
        {
          id: 3,
          examName: '初级A',
          examType: '初级',
          score: '100',
          startTime: '2019-10-5 08:00:00',
          endTime: '2019-10-5 16:00:00',
          creator: '朱士虎',
          createTime: '2019-10-15 16:00:00'
        },
        {
          id: 4,
          examName: '初级A',
          examType: '初级',
          score: '100',
          startTime: '2019-10-5 08:00:00',
          endTime: '2019-10-5 16:00:00',
          creator: '朱士虎',
          createTime: '2019-10-15 16:00:00'
        }
      ]
      this.list = att
      this.total = att.length
      this.listLoading = false
      // fetchList().then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },
    // 确定
    searchPaper() {
      this.$router.push('/game/resultSearchDetail/first')
    },
    chosePaper(val) {
      this.currentRow = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .resultByExam{
    width: 100%;
    height: 100%;
    .title{
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      color: #333333;
      text-align: center;
      background-color: #EEEEEE;
    }
    .filter-container{
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      border-bottom: solid 1px #EEEEEE;
    }
    .table-content{
      height: 280px;
      padding: 20px;
      overflow-y: auto;
    }
  }
</style>
