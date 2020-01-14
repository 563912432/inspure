<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" class="menu-parent">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="choseItem"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :chose-base-router="choseBaseRouter" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      choseBaseRouter: ''
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    choseItem(index, indexPath) {
      const number = (index.split('/')).length - 1
      if (number > 1) {
        this.choseBaseRouter = '/' + index.match(/\/(.*?)\//)[1]
      } else {
        console.log(index)
        if (index === '/dashboard') {
          this.choseBaseRouter = '/'
        } else {
          this.choseBaseRouter = index
        }
      }
    }
  }
}
</script>
<style>
  .el-menu--popup-right-start{
    margin-left: 0;
  }
  .el-menu--popup-right-start .el-menu-item{
    height: 45px;
    line-height: 45px;
  }
  .el-menu--popup{
    box-shadow: none;
    border-radius: 0;
    min-width: 100px;
  }
</style>
