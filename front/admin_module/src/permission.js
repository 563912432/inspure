import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import { setToken } from '@/utils/auth' // get token from cookie
import { getMenu, getRole } from '@/utils/menu'
import getPageTitle from '@/utils/get-page-title'
import Cookie from 'js-cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // 加载条开始
  NProgress.start()

  // 页面title
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  // const hasToken = getToken()
  // 本地测试 往cookie里面写测试数据
  const hasToken = '6d3b48369dabd35db5e18bcadeda9dc0'
  setToken(hasToken)
  Cookie.set('scope', 1)
  if (hasToken) {
    // 说明是登录成功,【获取有权限的菜单】
    store.commit('user/SET_TOKEN', hasToken)
    if (store.getters.permission_routes && store.getters.permission_routes.length > 6) { // 除去基本菜单
      next()
    } else {
      try {
        if (!getMenu() && !getRole()) {
          await store.dispatch('user/getInfo')
        } else {
          await store.dispatch('permission/generateRoutes', { is_super: parseInt(getRole()), menu: JSON.parse(getMenu()) })
          router.addRoutes(store.getters.permission_routes)
        }
        next({ ...to, replace: true })
      } catch (error) {
        console.log(error)
        // await store.dispatch('user/resetToken')
        // Message.error(error || 'Has Error')
        // next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    // 没拿到token
    location.href = window.domain
    NProgress.done()
  }
})

router.afterEach(() => {
  // 加载条完成
  NProgress.done()
})
