<template>
  <div class="analysisExamParent">
    <div class="analysisExam bg-white box-shadow">
      <div class="title">选择考试</div>
      <div class="filter-container">
        <el-input v-model="listQuery.name" size="mini" clearable placeholder="请输入考试名称" class="w-190 mr-20">
          <el-button slot="append" icon="el-icon-search" @click="getList" />
        </el-input>
        <el-input v-model="listQuery.time" size="mini" clearable placeholder="请输入考试时间" class="w-190 mr-20">
          <el-button slot="append" icon="el-icon-search" @click="getList" />
        </el-input>
        <el-select v-model="listQuery.examType" size="mini" clearable placeholder="请选择" class="w-190">
          <el-option label="全部" value="" />
          <el-option v-for="(item, index) in examTypeList" :key="index" :lable="item.key" :value="item.value" />
        </el-select>
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
          @selection-change="chosePaper"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column label="考试名称" width="" prop="examName" align="center" />
          <el-table-column label="分类" width="" prop="examType" align="center" />
          <el-table-column label="总分" width="" prop="score" align="center" />
          <el-table-column label="开始时间" width="" prop="startTime" align="center" />
          <el-table-column label="结束时间" width="" prop="endTime" align="center" />
          <el-table-column label="举办机构" prop="createOrg" width="" align="center" />
        </el-table>
      </div>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <div class="h-30 text-right">
        <el-button size="mini" class="mr-20" type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AnalysisExam',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        name: '',
        examType: '',
        time: '',
        page: 1,
        limit: 10
      },
      listLoading: false,
      list: [],
      total: 0
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
      this.list = [
        { examName: '初级会计考试下午', examType: '证书考试', score: '100', startTime: '2019-07-12 14:18', endTime: '2019-07-31 14:16', createOrg: '浪潮' },
        { examName: '基础会计期末考试', examType: '比赛考试', score: '45', startTime: '2019-07-12 14:18', endTime: '2019-07-31 14:16', createOrg: '山东财经大学' },
        { examName: '会计实操考试', examType: '自主考试', score: '45', startTime: '2019-07-12 14:18', endTime: '2019-07-31 14:16', createOrg: '自主考试' }
      ]
      this.total = 3
      this.listLoading = false
    },
    // 确定
    confirm() {
      this.$router.push('dataAnalysisExamDetail/1')
    },
    chosePaper() {}
  }
}
</script>

<style lang="scss" scoped>
  .analysisExamParent{
    width: 80%;
    min-width: 600px;
    overflow-x: auto;
    overflow-y: hidden;
    height: 530px;
    margin: 80px auto 0;
    .analysisExam{
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
  }
</style>
