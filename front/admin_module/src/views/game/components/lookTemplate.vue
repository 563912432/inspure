<template>
  <div class="look-template">
    <img src="../../../assets/image/zsmb1.jpg">
    <img src="../../../assets/image/zsmb2.jpg">
    <img src="../../../assets/image/zsmb3.jpg">
    <img src="../../../assets/image/zsmb4.jpg">
  </div>
</template>

<script>
export default {
  name: 'LookTemplate'
}
</script>

<style scoped>
  .look-template {
    width: 100%;
    height: 500px;
    overflow-y: auto;
  }
  .look-template img{
    width: 100%;
    margin-top: 5px;
  }
</style>
