<template>
  <div class="DataAnalysisExamBigTiMu p-10">
    <div style="margin-bottom: 12px" class="border-e8">
      <div style="font-size: 20px;font-weight:bold;border-bottom: solid 1px #e8e8e8" class="p-10">初级会计上午考试-大题分析</div>
      <div class="p-10" style="border-bottom: solid 1px #e8e8e8">
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
                <el-button size="mini" type="primary" @click="getStudentList">
                  查询
                </el-button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div>
          <el-table
            v-loading="studentLoading"
            size="mini"
            :data="studentTable"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="考生姓名" width="" prop="name" align="center" />
            <el-table-column label="所属机构" width="" prop="org" align="" show-overflow-tooltip />
            <el-table-column label="手机号" width="" prop="tel" align="center" show-overflow-tooltip />
            <el-table-column label="分数" width="" prop="score" align="center" />
            <el-table-column label="排名" width="" prop="rank" align="center" show-overflow-tooltip />
            <el-table-column label="正确题数" width="" prop="rightNum" align="center" />
            <el-table-column label="错误题数" width="" prop="wrongNum" align="center" />
          </el-table>
          <pagination v-show="studentTotal>0" class="text-center" :total="studentTotal" :page.sync="pageQueryStudent.page" :limit.sync="pageQueryStudent.page_size" @pagination="getStudentList" />
        </div>
      </div>
      <div class="p-10">
        <div class="flex flex-justify-space-between flex-align-center mb-12">
          <span>
            <span>所属机构</span>
            <el-select v-model="contrastValue" size="small" placeholder="请选择" class="ml-3">
              <el-option label="全部机构" value="全部机构" />
            </el-select>
          </span>
          <el-button type="primary" size="small">导出</el-button>
        </div>
        <div>
          <el-table
            v-loading="orgLoading"
            size="mini"
            :data="orgTable"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="所属机构" width="" prop="name" align="" show-overflow-tooltip />
            <el-table-column label="最高分" prop="maxScore" width="" align="center" />
            <el-table-column label="最第分" prop="minScore" width="" align="center" />
            <el-table-column label="平均分" prop="avgScore" width="" align="center" />
            <el-table-column label="排名" prop="rank" width="" align="center" />
          </el-table>
          <pagination v-show="orgTotal>0" class="text-center" :total="orgTotal" :page.sync="pageQueryOrg.page" :limit.sync="pageQueryOrg.page_size" @pagination="getOrgList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'DataAnalysisExamBigTiMu',
  components: { Pagination },
  data() {
    return {
      searchState: false,
      listQuery: {
        type: '',
        difficulty_id: '',
        knowledge_point_id: '',
        from: ''
      },
      studentTable: [],
      studentTotal: 3,
      pageQueryStudent: {
        page: 1,
        page_size: 10
      },
      studentLoading: false,
      contrastValue: '',
      orgTable: [],
      orgTotal: 3,
      pageQueryOrg: {
        page: 1,
        page_size: 10
      },
      orgLoading: false
    }
  },
  created() {
    this.getStudentList()
    this.getOrgList()
  },
  methods: {
    getStudentList() {
      this.studentLoading = true
      this.studentTable = [
        { name: '袁金娇', org: '山东财经大学', tel: '13393838383', score: '60.00', rank: '1', rightNum: '10', wrongNum: '10' },
        { name: '沈思怡', org: '山东工程学院', tel: '15288857648', score: '60.00', rank: '2', rightNum: '10', wrongNum: '10' },
        { name: '蔡均霞', org: '济南职业学院', tel: '17284838382', score: '60.00', rank: '3', rightNum: '10', wrongNum: '10' }
      ]
      this.studentTotal = 3
      this.studentLoading = false
    },
    getOrgList() {
      this.orgLoading = true
      this.orgTable = [
        { name: '山东财经大学', maxScore: '100', minScore: '60', avgScore: '80', rank: '1' },
        { name: '山东工程学院', maxScore: '100', minScore: '45', avgScore: '80', rank: '2' },
        { name: '济南职业学院', maxScore: '100', minScore: '60', avgScore: '80', rank: '3' }
      ]
      this.orgTotal = 3
      this.orgLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .DataAnalysisExamBigTiMu{
    position: relative;
    .border-e8 {
      border: solid 1px #e8e8e8;
    }
    .search-more-content{
      left: 0;
      width: 375px;
    }
  }
</style>
