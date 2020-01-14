<template>
  <div class="mail">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <!--      <el-radio-group v-model="tabPosition">-->
      <!--        <el-radio-button label="1">收信箱</el-radio-button>-->
      <!--        <el-radio-button label="2">发信箱</el-radio-button>-->
      <!--      </el-radio-group>-->
      <div class="mb-12">
        <Outbox />
        <!--        <Inbox v-if="tabPosition === '1'" />-->
        <!--        <Outbox v-else-if="tabPosition === '2'" />-->
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/views/common/header-span'
import Outbox from './components/Outbox'
export default {
  name: 'Mail',
  components: { Header, Outbox },
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
  .mail .el-radio-button__inner{
    width: 100px!important;
    padding: 8px 0!important;
  }
</style>
<style scoped>

</style>
