<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item ref="menuItem" :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item
            :icon="item.path === choseBaseRouter?(item.meta&&'chose-' + item.meta.icon) || 'chose-' + onlyOneChild.meta.icon:onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
    <!--如果有子菜单-->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item
          :icon="item.path === choseBaseRouter?(item.meta&&'chose-' + item.meta.icon) || 'chose-' + item.meta.icon:item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    choseBaseRouter: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style>
  /*.el-popover{*/
  /*  padding: 10px!important;*/
  /*  font-size: 13px!important;*/
  /*}*/
  .el-menu-item.submenu-title-noDropdown{
    padding-left: 10px!important;
  }
  .el-submenu__title{
    padding-left: 10px!important;
    padding-right: 0;
  }
  .el-submenu__title i{
    color: #ffffff;
    right: 5px;
  }
  .el-submenu__icon-arrow{
    margin-top: -5px!important;
  }
  .el-menu--vertical .el-menu{
    background-color: #ffffff!important;
    box-shadow: 2px 2px 2px 0 rgba(217,217,217,0.50);
  }
  .el-menu--vertical .nest-menu .el-menu-item{
    background-color: #ffffff!important;
    color: #333333!important;
    font-size: 13px!important;
  }
  .el-menu--vertical .nest-menu .el-menu-item:hover,
  .el-menu--vertical .nest-menu .el-menu-item:focus{
    background-color: #D8F1FF!important;
  }
</style>
<style lang="scss" scoped>
  .menu-children-div{
    width: 100%;
    height: 56px;
    font-size: 14px;
    color: white;
  }
</style>
