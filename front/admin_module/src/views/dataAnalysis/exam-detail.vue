<template>
  <div class="DataAnalysisExamDetail">
    <el-tabs v-model="activeName" class="module-tabs" type="card">
      <el-tab-pane label="成绩统计" name="first" class="pt-12">
        <DataAnalysisExamScore class="bg-white" />
      </el-tab-pane>
      <el-tab-pane label="大题分析" name="second" class="pt-12">
        <DataAnalysisExamBigTiMu class="bg-white" />
      </el-tab-pane>
      <el-tab-pane label="试题分析" name="third" class="pt-12">
        <DataAnalysisExamTiMu class="bg-white" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataAnalysisExamScore from './components/examScore'
import DataAnalysisExamBigTiMu from './components/examBigTiMu'
import DataAnalysisExamTiMu from './components/examTiMu'
export default {
  name: 'DataAnalysisExamDetail',
  components: { DataAnalysisExamTiMu, DataAnalysisExamBigTiMu, DataAnalysisExamScore },
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

</style>
