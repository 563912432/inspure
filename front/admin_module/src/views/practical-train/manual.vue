<!--手工账页面-->
<template>
  <div class="manual">
    <iframe class="manual-detail" :src="src" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'Manual',
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
      this.src = window.domain + 'shou_gong_zhang/#/admin'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .manual {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 100px);
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    .manual-detail{
      flex: 1;
      width: 100%;
      position: relative;
      z-index: 1;
    }
  }
</style>
