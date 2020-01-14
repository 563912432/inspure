<template>
  <div class="ResultSearchDetail">
    <Header :title="title" :is-back-show="true" />
    <div class="bg-white box-shadow">
      <el-tabs v-model="activeName" class="mail-tabs" type="card" @tab-click="checkInfo">
        <el-tab-pane label="按比赛查询批改" name="first">
          <DetailExam />
        </el-tab-pane>
        <el-tab-pane label="按考生查询批改" name="second">
          <DetailStudent />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Header from '@/views/common/header'
import DetailExam from './components/detailExam'
import DetailStudent from './components/detailStudent'
export default {
  name: 'ResultSearchDetail',
  components: { Header, DetailExam, DetailStudent },
  data() {
    return {
      activeName: ''
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    searchResult() {
      return '1' // 默认是考试
    }
  },
  created() {
    this.activeName = this.$route.params.type
  },
  methods: {
    checkInfo() {
      if (this.searchResult === '1' && this.activeName === 'second') {
        // this.$store.dispatch('teachClass/saveSearchResult', '2')
        this.$router.push('/game/correction/2')
      }
      if (this.searchResult === '2' && this.activeName === 'first') {
        // this.$store.dispatch('teachClass/saveSearchResult', '1')
        this.$router.push('/game/correction/1')
      }
    }
  }
}
</script>
<style>
  .ResultSearchDetail .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    border-bottom-color: #93C343;
    border-bottom-width: 2px;
  }
  .ResultSearchDetail .el-tabs__header{
    margin: 0;
    padding: 10px 0 0 10px;
    border-bottom-color: transparent;
  }
  .ResultSearchDetail .mail-tabs .el-tabs__nav{
    border-radius:0;
    border-top: none;
  }
  .ResultSearchDetail .mail-tabs .el-tabs__item{
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    width: 120px;
    text-align: center;
    border-top: solid 1px #D7D7D7;
    border-bottom: solid 1px #D7D7D7;
  }
</style>
<style scoped>

</style>
