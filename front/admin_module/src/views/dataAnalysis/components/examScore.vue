<template>
  <div class="DataAnalysisExamScore p-10">
    <div style="margin-bottom: 12px" class="border-e8">
      <div style="font-size: 20px;font-weight:bold;border-bottom: solid 1px #e8e8e8" class="p-10">初级会计上午考试</div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">考试分类：</span><span>证书考试</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">应考人数：</span>
          <span>1人（实考1人，参考率100%）</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">总分：</span><span>100分</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">平均分：</span>
          <span>60分</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">及格分：</span><span>60分（及格率0%）</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">最高分：</span>
          <span>100分</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">答题时长：</span><span>60分钟（平均答题时长9秒）</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">最低分：</span>
          <span>0分</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">考试时间：</span><span>2019-07-01 16:21:12 - 2019-07-16 17:05:20</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-135">举办机构：</span>
          <span>浪潮</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="module-tabs" type="card">
      <el-tab-pane label="成绩分析" name="first" class="pt-10 bg-white box-shadow">
        <div class="f-13 border-e8 p-10">
          <div class="flex flex-justify-space-between flex-align-center mb-12">
            <span>
              <span>对比机构</span>
              <el-select v-model="contrastValue" size="small" placeholder="请选择" class="ml-3">
                <el-option label="全部机构" value="全部机构" />
              </el-select>
            </span>
            <el-button type="primary" size="small">导出答题情况</el-button>
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
              <el-table-column label="应考人数" width="" prop="yingkao" align="center" />
              <el-table-column label="实考人数" width="80" prop="shikao" align="center" />
              <el-table-column label="参考率" prop="cankaolv" width="" align="center" />
              <el-table-column label="及格率" prop="jigelv" width="" align="center" />
              <el-table-column label="最高分" prop="maxScore" width="" align="center" />
              <el-table-column label="平均分" prop="avgScore" width="" align="center" />
              <el-table-column label="平均时长" prop="avgTimeLong" width="" align="center" />
            </el-table>
            <pagination v-show="orgTotal>0" class="text-center" :total="orgTotal" :page.sync="pageQueryOrg.page" :limit.sync="pageQueryOrg.page_size" @pagination="getOrg" />
          </div>
          <!--折线图-->
          <div>
            <ColumnGrade :id="'ColumnGrade'" :class-name="'ColumnGrade'" :width="'100%'" :height="'400px'" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分数段统计" name="second" class="pt-10 bg-white box-shadow">
        <div class="f-13 border-e8 p-10">
          <div class="flex flex-justify-space-between flex-align-center mb-12">
            <span>
              <span>对比考试：</span>
              <el-select v-model="contrastExamValue" multiple size="small" placeholder="请选择" class="ml-3">
                <el-option label="初级会计上午" value="初级会计上午" />
                <el-option label="初级会计下午" value="初级会计下午" />
                <el-option label="会计实训考试" value="会计实训考试" />
              </el-select>
            </span>
            <span>
              <el-button type="primary" size="small">分数段设置</el-button>
              <el-button v-if="sectionChartType === 1" plain size="small" @click="sectionChartType = 2">饼状图</el-button>
              <el-button v-else plain size="small" @click="sectionChartType = 1">柱状图</el-button>
              <el-button plain size="small">导出</el-button>
            </span>
          </div>
          <div v-if="sectionChartType === 1">
            <ColumnGradeSection :id="'ColumnGradeSection'" :class-name="'ColumnGradeSection'" :width="'100%'" :height="'400px'" />
          </div>
          <div v-else>
            <PieGradeSection :id="'PieGradeSection'" :class-name="'PieGradeSection'" :width="'100%'" :height="'400px'" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="考生信息" name="third" class="pt-10 bg-white box-shadow">
        <div class="f-13 border-e8 p-10">
          <div class="flex flex-justify-space-between flex-align-center mb-12">
            <span>
              <span>筛选考生</span>
              <el-select v-model="studentState" multiple size="small" placeholder="请选择" class="ml-3">
                <el-option label="全部考生" value="全部考生" />
                <el-option label="及格" value="及格" />
                <el-option label="不及格" value="不及格" />
                <el-option label="已考" value="已考" />
                <el-option label="漏考" value="漏考" />
              </el-select>
              <span class="ml-10">对比机构</span>
              <el-select v-model="contrastValue" size="small" placeholder="请选择" class="ml-3">
                <el-option label="全部机构" value="全部机构" />
              </el-select>
            </span>
            <el-button type="primary" size="small">导出</el-button>
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
              <el-table-column label="所属机构" width="" prop="org" align="center" show-overflow-tooltip />
              <el-table-column label="手机号" width="" prop="tel" align="center" show-overflow-tooltip />
              <el-table-column label="答题时长" width="" prop="timeLong" align="center" />
              <el-table-column label="交卷时间" width="" prop="submitTime" align="" show-overflow-tooltip />
              <el-table-column label="成绩" width="" prop="score" align="center" />
              <el-table-column label="结果" width="" prop="result" align="center" />
            </el-table>
            <pagination v-show="studentTotal>0" class="text-center" :total="studentTotal" :page.sync="pageQueryStudent.page" :limit.sync="pageQueryStudent.page_size" @pagination="getStudent" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ColumnGrade from './columnGrade'
import ColumnGradeSection from './columnGradeSection'
import PieGradeSection from './pieGradeSection' // secondary package based on el-pagination
export default {
  name: 'DataAnalysisExamScore',
  components: { PieGradeSection, ColumnGradeSection, ColumnGrade, Pagination },
  data() {
    return {
      activeName: 'first',
      contrastValue: '',
      orgTable: [],
      orgTotal: 3,
      pageQueryOrg: {
        page: 1,
        page_size: 10
      },
      orgLoading: false,
      sectionChartType: 1,
      contrastExamValue: ['初级会计上午', '初级会计下午', '会计实训考试'],
      studentState: ['全部考生', '及格', '不及格', '已考', '漏考'],
      studentTable: [],
      studentTotal: 3,
      pageQueryStudent: {
        page: 1,
        page_size: 10
      },
      studentLoading: false
    }
  },
  created() {
    this.getOrg()
    this.getStudent()
  },
  methods: {
    getOrg() {
      this.orgLoading = true
      this.orgTable = [
        { name: '山东财经大学', yingkao: '40', shikao: '40', cankaolv: '100.00%', jigelv: '0%', maxScore: '100', avgScore: '80', avgTimeLong: '60.00分钟' },
        { name: '山东工程学院', yingkao: '40', shikao: '40', cankaolv: '100.00%', jigelv: '0%', maxScore: '100', avgScore: '80', avgTimeLong: '60.00分钟' },
        { name: '济南职业学院', yingkao: '40', shikao: '40', cankaolv: '100.00%', jigelv: '0%', maxScore: '100', avgScore: '80', avgTimeLong: '60.00分钟' }
      ]
      this.orgTotal = 3
      this.orgLoading = false
    },
    getStudent() {
      this.studentLoading = true
      this.studentTable = [
        { name: '袁金娇', org: '山东财经大学', tel: '13393838383', timeLong: '60.00', submitTime: '2019-07-12 17:48:23', score: '100', result: '及格' },
        { name: '沈思怡', org: '山东工程学院', tel: '15288857648', timeLong: '60.00', submitTime: '2019-07-12 17:48:23', score: '100', result: '及格' },
        { name: '蔡均霞', org: '济南职业学院', tel: '17284838382', timeLong: '60.00', submitTime: '2019-07-12 17:48:23', score: '100', result: '及格' }
      ]
      this.studentTotal = 3
      this.studentLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .DataAnalysisExamScore {
    .border-e8 {
      border: solid 1px #e8e8e8;
    }
  }
</style>
