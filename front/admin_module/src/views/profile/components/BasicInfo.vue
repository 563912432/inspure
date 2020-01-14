<template>
  <div class="basicInfo f-14 pt-20">
    <div class="item"><span class="mr-20">姓名：</span><span>{{ name }}</span></div>
    <div class="item"><span class="mr-20">工号：</span><span>{{ number }}</span></div>
    <div class="item"><span class="mr-20">性别：</span><span>{{ sex === 1?'男':'女' }}</span></div>
    <div class="item"><span class="mr-20">部门：</span><span>{{ department }}</span></div>
  </div>
</template>

<script>
export default {
  name: 'BasicInfo',
  computed: {
    name() {
      return this.$store.getters.name
    },
    number() {
      return this.$store.state.user.userInfo['number']
    },
    sex() {
      return this.$store.state.user.userInfo['sex']
    },
    department() {
      return this.$store.state.user.userInfo['department_id']
    }
  }
}
</script>

<style lang="scss" scoped>
  .basicInfo{
    letter-spacing: 1px;
    .item{
      height: 40px;
      line-height: 40px;
    }
  }
</style>
