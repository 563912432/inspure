<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 90px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: transparent;
  /*box-shadow: 2px 0 3px rgba(0, 0, 0, 0.349019607843137);*/
  /*box-shadow: 0 1px 2px 1px rgba(224,224,224,0.50)*/
}

.fixed-header+.app-main {
  /*padding-top: 40px;*/
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 150px);
  }

  .fixed-header+.app-main {
    margin-top: 80px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
