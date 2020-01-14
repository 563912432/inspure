<template>
  <div class="header-span">
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'HeaderSpan',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>

<style scoped>
.header-span{
  font-size: 13px;
  color: #030303;
  font-weight: bold;
}
</style>
