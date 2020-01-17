<template>
  <div class="resources-manage">
    <Header :title="title" class="mb-12" />
    <el-tabs v-model="activeName" class="mail-tabs" type="card">
      <el-tab-pane label="题库" name="first">
        <SourcesObjectKu />
      </el-tab-pane>
      <el-tab-pane label="实训题库" name="second">
        <AccountKu />
      </el-tab-pane>
      <el-tab-pane label="教学包" name="third">
        <TeachingPackageKu />
      </el-tab-pane>
      <el-tab-pane label="老师班课资源列表" name="fourth">
        <TeacherClass />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Header from '@/views/common/header'
import SourcesObjectKu from '@/views/organ/components/objectKu'
import AccountKu from './components/accountKu'
import TeachingPackageKu from './components/teachingPackageKu'
import TeacherClass from './components/teacherClass'
export default {
  name: 'Resources',
  components: { TeacherClass, TeachingPackageKu, AccountKu, Header, SourcesObjectKu },
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
  .resources-manage .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .resources-manage .el-tabs__header{
    margin: 0;
    /*padding: 10px 0 0 10px;*/
    border-bottom-color: transparent;
  }
  .resources-manage .mail-tabs .el-tabs__nav{
    border-radius:0;
    border-top: none;
  }
  .resources-manage .el-tabs__nav .is-top {
    background-color: #ffffff;
  }
  .resources-manage .mail-tabs .el-tabs__item{
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    width: 150px;
    text-align: center;
    border-top: solid 1px #D7D7D7;
    border-bottom: solid 1px #D7D7D7;
  }
</style>
<style scoped lang="scss">

</style>
