<template>
  <div class="wrong">
    <Header :title="title" />
    <el-tabs v-model="activeName" class="wrong-tabs">
      <el-tab-pane label="考试错题" name="first">
        <WrongExam />
      </el-tab-pane>
      <el-tab-pane label="作业测试错题" name="second">
        <WrongZuoye />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Header from '@/views/common/header'
import WrongExam from './wrong-exam'
import WrongZuoye from './wrong-zuoye'
export default {
  name: 'Wrong',
  components: { WrongZuoye, WrongExam, Header },
  data() {
    return {
      activeName: 'first'
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  }
}
</script>

<style>
  .wrong .el-tabs__header{
    margin: 0;
    /*padding: 10px 0 0 10px;*/
    border-bottom-color: transparent;
  }
  .wrong .wrong-tabs .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .wrong .wrong-tabs .el-tabs__item {
    font-size: 16px;
  }
</style>
<style lang="scss" scoped>
  .wrong {
  }
</style>
