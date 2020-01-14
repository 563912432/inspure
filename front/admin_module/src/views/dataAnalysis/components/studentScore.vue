<template>
  <div class="DataAnalysisStudentScore">
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
        <el-table-column label="平均分（分数）" prop="avgScore" width="" align="center" />
        <el-table-column label="张三（得分）" prop="score1" width="" align="center" />
        <el-table-column label="李四（得分）" prop="score2" width="" align="center" />
      </el-table>
      <pagination v-show="examTotal>0" class="text-center" :total="examTotal" :page.sync="pageQueryExam.page" :limit.sync="pageQueryExam.page_size" @pagination="getExam" />
    </div>
    <div style="border-bottom: solid 1px #e8e8e8">
      <div class="mt-10 mb-10 bold">成绩分析图</div>
      <div>
        <LineScore :id="'LineScore'" :class-name="'LineScore'" :width="'100%'" :height="'400px'" />
      </div>
    </div>
    <div>
      <div class="mt-10 mb-10 bold">错题统计</div>
      <div class="filter-container flex flex-justify-space-between flex-align-center">
        <div class="search-more fl mr-20" @click="searchState = !searchState">
          <span>高级搜索</span>
          <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
        </div>
        <span>
          <el-button type="primary" size="small">导出</el-button>
        </span>
        <el-collapse-transition>
          <div v-show="searchState" class="search-more-content">
            <div class="mb-20">
              <span class="w-80 inline-block text-right">题目类型：</span>
              <el-select v-model="listQuery.type" placeholder="请选择题目类型" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </div>
            <div class="mb-20">
              <span class="w-80 inline-block text-right">难度：</span>
              <el-select v-model="listQuery.difficulty_id" placeholder="请选择难度" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </div>
            <div class="mb-20">
              <span class="w-80 inline-block text-right">知识点：</span>
              <el-select v-model="listQuery.knowledge_point_id" placeholder="请选择知识点" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </div>
            <div class="mb-20">
              <span class="w-80 inline-block text-right">来源：</span>
              <el-select v-model="listQuery.from" placeholder="请选择来源" size="small" clearable class="w-190">
                <el-option label="全部" value="" />
              </el-select>
            </div>
            <div class="text-right">
              <el-button size="mini" type="primary" @click="getWrongExam">
                查询
              </el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <el-table
        v-loading="wrongTiMuLoading"
        size="mini"
        :data="wrongTiMuTable"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="题型" width="" prop="type" align="center" />
        <el-table-column label="题目内容" width="" prop="content" align="" show-overflow-tooltip />
        <el-table-column label="正确答案" width="" prop="rightAnswer" align="center" />
        <el-table-column label="考生答案" prop="myAnswer" width="" align="center" />
        <el-table-column label="答题次数" prop="time" width="" align="center" />
      </el-table>
      <pagination v-show="wrongTiMuTotal>0" class="text-center" :total="examTotal" :page.sync="pageQueryWrongTiMu.page" :limit.sync="pageQueryWrongTiMu.page_size" @pagination="getWrongExam" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import LineScore from './lineScore'
export default {
  name: 'DataAnalysisStudentScore',
  components: { LineScore, Pagination },
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
      },
      wrongTiMuTable: [],
      wrongTiMuTotal: 3,
      pageQueryWrongTiMu: {
        page: 1,
        page_size: 10
      },
      wrongTiMuLoading: false
    }
  },
  created() {
    this.getExam()
    this.getWrongExam()
  },
  methods: {
    getExam() {
      this.examLoading = true
      this.examTable = [
        { name: '基础会计期末考试', type: '自主考试', org: '山东财经大学', avgScore: '80', score1: '40', score2: '100' },
        { name: '初级会计考试', type: '证书考试', org: '浪潮', avgScore: '80', score1: '80', score2: '70' },
        { name: '会计实操考试', type: '比赛考试', org: '山东财经大学', avgScore: '100', score1: '90', score2: '50' }
      ]
      this.examTotal = 3
      this.examLoading = false
    },
    getWrongExam() {
      this.wrongTiMuLoading = true
      this.wrongTiMuTable = [
        { type: '单选题', content: ' 企业从事花卉种植的所得，减半征收企业所得税', rightAnswer: 'A', myAnswer: 'A', time: '2' },
        { type: '多选题', content: '根据契税法律制度的规定，下列行为中，应征收契税的是（）', rightAnswer: 'A', myAnswer: 'A', time: '1' },
        { type: '简答题', content: '根据支付结算法律制度的规定，关于委托收款结算方式的下列表述，正确的有（）', rightAnswer: 'C', myAnswer: 'A', time: '3' },
        { type: '单选题', content: '企业从事花卉种植的所得，减半征收企业所得税', rightAnswer: 'A', myAnswer: 'A', time: '2' }
      ]
      this.wrongTiMuTotal = 3
      this.wrongTiMuLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
