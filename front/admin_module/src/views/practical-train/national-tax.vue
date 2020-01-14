<!--国税页面-->
<template>
  <div class="nationalTax">
    <iframe class="nationalTax-detail" :src="src" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'NationalTax',
  data() {
    return {
      fromUrl: '',
      src: '',
      system: ''
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.src = window.domain + 'guo_shui/#/admin'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .nationalTax {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 100px);
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    .nationalTax-detail{
      flex: 1;
      width: 100%;
      position: relative;
      z-index: 1;
    }
  }
</style>
