<template>
  <div class="createPackage">
    <Header :title="title" />
    <el-tabs v-model="activeName" class="create-package-tabs bg-white pl-10 pr-10">
      <el-tab-pane label="编辑课程" name="first">
        <EditCourse v-if="!editCourseState" />
        <EditChapter v-else />
      </el-tab-pane>
      <el-tab-pane label="课程详情" name="second">
        <CourseDetail />
      </el-tab-pane>
      <el-tab-pane label="发布教学包" name="third" />
    </el-tabs>
  </div>
</template>

<script>
import Header from '../common/header'
import EditCourse from './components/editCourse'
import CourseDetail from './components/courseDetail'
import EditChapter from './components/editChapter'
export default {
  name: 'CreatePackage',
  components: { EditChapter, CourseDetail, EditCourse, Header },
  data() {
    return {
      activeName: 'first'
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    editCourseState() {
      return this.$store.getters.editCourseState
    }
  }
}
</script>

<style>
  .pl-10 {
    padding-left: 10px;
  }
  .pr-10 {
    padding-right: 10px;
  }
  .createPackage .create-package-tabs .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .createPackage .create-package-tabs .el-tabs__item{
    height: 20px;
    line-height: 20px;
    margin: 15px 0;
    padding: 0 30px;
    font-size: 15px;
    border-right:  solid 1px #dcdfe6;
  }
  .createPackage .create-package-tabs .el-tabs__item:last-child{
    border-right: none;
  }
  .createPackage .create-package-tabs .el-tabs__nav-wrap::after{
    height: 1px;
  }
</style>
<style scoped lang="scss">
</style>
