<template>
  <div class="wrong-zuoye">
    <el-tabs v-model="activeName" class="mail-tabs" type="card">
      <el-tab-pane label="理论题" name="first">
        <WrongZuoyeLilun />
      </el-tab-pane>
      <el-tab-pane label="实训题" name="second">
        <WrongZuoyeShixun />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WrongZuoyeLilun from './components/wrong-zuoye-lilun'
import WrongZuoyeShixun from './components/wrong-zuoye-shixun'
export default {
  name: 'WrongZuoye',
  components: { WrongZuoyeShixun, WrongZuoyeLilun },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style>
  .wrong-zuoye .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .wrong-zuoye .el-tabs__header{
    margin: 0;
    /*padding: 10px 0 0 10px;*/
    border-bottom-color: transparent;
  }
  .wrong-zuoye .mail-tabs .el-tabs__nav{
    border-radius:0;
    border-top: none;
  }
  .wrong-zuoye .el-tabs__nav .is-top {
    background-color: #ffffff;
  }
  .wrong-zuoye .mail-tabs .el-tabs__item{
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
  .wrong-zuoye {
    margin-top: 12px;
  }
</style>
