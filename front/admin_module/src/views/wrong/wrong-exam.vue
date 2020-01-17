<template>
  <div class="wrong-exam">
    <el-tabs v-model="activeName" class="mail-tabs" type="card">
      <el-tab-pane label="理论题" name="first">
        <WrongExamLilun />
      </el-tab-pane>
      <el-tab-pane label="实训题" name="second">
        <WrongExamShixun />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WrongExamLilun from './components/wrong-exam-lilun'
import WrongExamShixun from './components/wrong-exam-shixun'
export default {
  name: 'WrongExam',
  components: { WrongExamShixun, WrongExamLilun },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style>
  .wrong-exam .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .wrong-exam .el-tabs__header{
    margin: 0;
    /*padding: 10px 0 0 10px;*/
    border-bottom-color: transparent;
  }
  .wrong-exam .mail-tabs .el-tabs__nav{
    border-radius:0;
    border-top: none;
  }
  .wrong-exam .el-tabs__nav .is-top {
    background-color: #ffffff;
  }
  .wrong-exam .mail-tabs .el-tabs__item{
    height: 30px;
    line-height: 30px;
    font-size: 13px!important;
    width: 115px;
    text-align: center;
    border-top: solid 1px #D7D7D7;
    border-bottom: solid 1px #D7D7D7;
  }
</style>
<style scoped lang="scss">
  .wrong-exam {
    margin-top: 12px;
  }
</style>
