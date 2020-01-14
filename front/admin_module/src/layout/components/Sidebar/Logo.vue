<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img src="@/assets/image/logo.png" class="sidebar-logo">
        <!--        <h1 class="sidebar-title">{{ title }} </h1>-->
        <span class="triangle" />
        <span class="triangle-title">教</span>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img src="@/assets/image/logo.png" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
        <span class="triangle" />
        <span class="triangle-title">教</span>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '浪潮云教育'
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #3A81D6;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.349019607843137);
  margin-bottom: 2px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 28px;
      height: 28px;
      vertical-align: middle;
      margin-right: 8px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 400;
      line-height: 50px;
      font-size: 15px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
    & .triangle{
      position: absolute;
      bottom: -25px;
      right: -35px;
      display: inline-block;
      width: 50px;
      height: 50px;
      background-color: #7CCB40;
      transform: rotate(-50deg);
    }
    & .triangle-title{
      display: inline-block;
      position: absolute;
      font-size: 12px;
      bottom: -18px;
      right: 0;
      color: #ffffff;
    }
  }

  /*&.collapse {*/
  /*  .sidebar-logo {*/
  /*    margin-right: 0px;*/
  /*  }*/
  /*}*/
}
</style>
