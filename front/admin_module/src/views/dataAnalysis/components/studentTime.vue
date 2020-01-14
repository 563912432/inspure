<template>
  <div class="DataAnalysisStudentTime">
    <div class="flex flex-justify-space-between flex-align-center mb-12">
      <span>
        <el-checkbox v-model="checked">仅查看机构自主安排的考试</el-checkbox>
      </span>
      <span>
        <el-select v-model="contrastValue" size="small" placeholder="添加对比" class="ml-3">
          <el-option label="添加对比考生" value="添加对比考生" />
          <el-option label="添加多场考试" value="添加多场考试" />
        </el-select>
        <el-button type="primary" size="small">导出</el-button>
      </span>
    </div>
    <div style="border-bottom: solid 1px #e8e8e8">
      <el-table
        v-loading="examLoading"
        size="mini"
        :data="examTable"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <!--name: '基础会计期末考试', type: '自主考试', org: '山东财经大学', avgScore: '80', score1: '40', score2: '100'-->
        <el-table-column label="考试名称" width="" prop="name" align="" show-overflow-tooltip />
        <el-table-column label="考试类型" width="" prop="type" align="center" />
        <el-table-column label="举办单位" width="" prop="org" align="center" />
        <el-table-column label="平均时长(分钟)" width="" prop="avgTime" align="center" />
        <el-table-column label="张三（答题时长）" prop="time1" width="" align="center" />
        <el-table-column label="李四（答题时长）" prop="time2" width="" align="center" />
      </el-table>
      <pagination v-show="examTotal>0" class="text-center" :total="examTotal" :page.sync="pageQueryExam.page" :limit.sync="pageQueryExam.page_size" @pagination="getExam" />
    </div>
    <div style="border-bottom: solid 1px #e8e8e8">
      <div class="mt-10 mb-10 bold">时长分析图</div>
      <div>
        <LineTime :id="'LineTime'" :class-name="'LineTime'" :width="'100%'" :height="'400px'" />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import LineTime from './lineTime'
export default {
  name: 'DataAnalysisStudentTime',
  components: { LineTime, Pagination },
  data() {
    return {
      checked: true,
      contrastValue: '',
      examTable: [],
      examTotal: 3,
      pageQueryExam: {
        page: 1,
        page_size: 10
      },
      examLoading: false,
      searchState: false,
      listQuery: {
        type: '',
        difficulty_id: '',
        knowledge_point_id: '',
        from: ''
      }
    }
  },
  created() {
    this.getExam()
  },
  methods: {
    getExam() {
      this.examLoading = true
      this.examTable = [
        { name: '基础会计期末考试', type: '自主考试', org: '山东财经大学', avgTime: '60', time1: '100', time2: '50' },
        { name: '初级会计考试', type: '证书考试', org: '浪潮', avgTime: '100', time1: '80', time2: '70' },
        { name: '会计实操考试', type: '比赛考试', org: '山东财经大学', avgTime: '80', time1: '30', time2: '100' }
      ]
      this.examTotal = 3
      this.examLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
