<!--认证页面-->
<template>
  <div class="certificate">
    <iframe class="certificate-detail" :src="src" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'Certificate',
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
      this.src = window.domain + 'ren_zheng/#/admin'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .certificate {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 100px);
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    .certificate-detail{
      flex: 1;
      width: 100%;
      position: relative;
      z-index: 1;
    }
  }
</style>
