<template>
  <div class="dictionaryItem">
    <Header :title="title" :is-back-show="true" :path-url="'index'" class="mb-12" />
    <div class="box-shadow bg-white pt-20">
      <div class="pl-5 pr-5 mb-12">
        <el-tabs v-model="tabPosition" class="module-tabs" type="card">
          <el-tab-pane label="课程分类" name="first">
            <CourseType />
          </el-tab-pane>
          <el-tab-pane label="知识点类型" name="second">
            <PointType />
          </el-tab-pane>
          <el-tab-pane label="难易度" name="third">
            <LevelSet />
          </el-tab-pane>
          <el-tab-pane label="适用层次" name="fourth">
            <GradeSet />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/views/common/header'
import PointType from './components/PointType'
import LevelSet from './components/LevelSet'
import CourseType from './components/courseCate'
import GradeSet from './components/gradeSet'
export default {
  name: 'DictionaryItem',
  components: { GradeSet, CourseType, Header, PointType, LevelSet },
  data() {
    return {
      tabPosition: 'first'
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
  .dictionaryItem .el-tabs__nav .is-top{
    background-color: #ffffff;
  }
  .dictionaryItem .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .dictionaryItem .el-tabs__header{
    margin: 0;
    border-bottom-color: transparent;
  }
  .dictionaryItem .module-tabs .el-tabs__nav{
    border-radius:0;
    border-top: none;
  }
  .dictionaryItem .module-tabs .el-tabs__item{
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
