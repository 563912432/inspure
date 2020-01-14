<template>
  <div class="DataAnalysisExamDetail bg-white p-10">
    <div style="margin-bottom: 12px" class="border-e8">
      <div style="font-size: 20px;font-weight:bold;border-bottom: solid 1px #e8e8e8" class="p-10">杨蕾的成绩总览</div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">学号：</span><span>15171301</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">姓名：</span>
          <span>张三</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">性别：</span><span>男</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">年级：</span>
          <span>2018级</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">院系：</span><span>商学院</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">专业：</span>
          <span>财务管理</span>
        </div>
      </div>
      <div class="flex f-13 col-666">
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">行政班：</span><span>18财管3班</span>
        </div>
        <div class="flex-1 p-10">
          <span style="display: inline-block" class="w-95">状态：</span>
          <span>在校</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="module-tabs" type="card">
      <el-tab-pane label="成绩分析" name="first" class="pt-12">
        <DataAnalysisStudentScore />
      </el-tab-pane>
      <el-tab-pane label="排名分析" name="second" class="pt-12">
        <DataAnalysisStudentRank />
      </el-tab-pane>
      <el-tab-pane label="答题时间分析" name="third" class="pt-12">
        <DataAnalysisStudentTime />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataAnalysisStudentScore from './components/studentScore'
import DataAnalysisStudentRank from './components/studentRank'
import DataAnalysisStudentTime from './components/studentTime'
export default {
  name: 'DataAnalysisExamDetail',
  components: { DataAnalysisStudentTime, DataAnalysisStudentScore, DataAnalysisStudentRank },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style>
  .DataAnalysisExamDetail .el-tabs__nav .is-top{
    background-color: #ffffff;
  }
  .DataAnalysisExamDetail .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .DataAnalysisExamDetail .el-tabs__header{
    margin: 0;
    border-bottom-color: transparent;
  }
  .DataAnalysisExamDetail .module-tabs .el-tabs__nav{
    border-radius:0;
    border-top: none;
  }
  .DataAnalysisExamDetail .module-tabs .el-tabs__item{
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    width: 120px;
    text-align: center;
    border-top: solid 1px #D7D7D7;
    border-bottom: solid 1px #D7D7D7;
  }
</style>
<style lang="scss" scoped>
  .DataAnalysisExamDetail{
    .border-e8 {
      border:solid 1px #e8e8e8;
    }
  }
</style>
