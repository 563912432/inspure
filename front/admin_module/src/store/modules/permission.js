import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 获取子菜单
 * @param menu
 * @param childrenRoutes
 */
function hasMenu(menu, childrenRoutes) {
  const tmp = []
  childrenRoutes.forEach((route, index) => {
    if (route.path && menu.indexOf(route.path) > -1) {
      tmp.push(route)
    }
  })
  // console.log(tmp)
  return tmp
}

export function filterAsyncRoutes(routes, menu) {
  const res = []
  const result = []
  routes.forEach((route, index) => {
    if (route.path && route.path !== '' && menu.indexOf(route.path) > -1) {
      res[index] = route
      if (route.children) {
        res[index]['children'] = hasMenu(menu, route.children)
      }
    }
  })
  res.forEach((v, i) => {
    result.push(v)
  })
  result.push({ path: '*', redirect: '/404', hidden: true })
  // console.log(result)
  return result
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 有权限的菜单
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      let accessedRoutes = []
      if (data.is_super) {
        accessedRoutes = asyncRoutes
      } else {
        const tmpMenu = []
        if (Array.isArray(data.menu) && data.menu.length > 0) {
          data.menu.forEach(v => {
            if (v.path && v.path !== '') {
              tmpMenu.push(v.path)
            }
          })
          accessedRoutes = filterAsyncRoutes(asyncRoutes, tmpMenu)
        }
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
