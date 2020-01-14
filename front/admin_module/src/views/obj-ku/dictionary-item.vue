<template>
  <div class="dictionaryItem">
    <Header :title="title" :is-back-show="true" :path-url="'index'" class="mb-12" />
    <div class="box-shadow bg-white pt-20">
      <div class="pl-5 mb-12">
        <el-radio-group v-model="tabPosition">
          <el-radio-button label="1">知识点类型</el-radio-button>
          <el-radio-button label="2">难易度</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <PointType v-if="tabPosition === '1'" />
        <LevelSet v-else-if="tabPosition === '2'" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/views/common/header'
import PointType from './components/PointType'
import LevelSet from './components/LevelSet'
export default {
  name: 'DictionaryItem',
  components: { Header, PointType, LevelSet },
  data() {
    return {
      tabPosition: '1'
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
  .dictionaryItem .el-radio-button__inner{
    width: 120px!important;
    padding: 8px 0!important;
  }
</style>
<style lang="scss" scoped>

</style>
