<!--开票页面-->
<template>
  <div class="invoice">
    <iframe class="invoice-detail" :src="src" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'Invoice',
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
      this.src = window.domain + 'kaipiao/#/admin'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .invoice {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 100px);
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    .invoice-detail{
      flex: 1;
      width: 100%;
      position: relative;
      z-index: 1;
    }
  }
</style>
