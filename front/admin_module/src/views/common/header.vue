<template>
  <div class="header">
    <span class="fl">{{ title }}</span>
    <span v-show="isBackShow" class="fr">
      <el-button plain size="mini" @click="goBack(pathUrl)">
        返回
      </el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    isBackShow: {
      type: Boolean,
      required: false,
      default: false
    },
    pathUrl: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    goBack() {
      if (this.pathUrl !== '') {
        this.$router.push(this.pathUrl)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped>
.header{
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  color: #030303;
  font-weight: bold;
}
</style>
