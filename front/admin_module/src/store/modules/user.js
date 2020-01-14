import { getInfo } from '@/api/user'
import router, { resetRouter } from '@/router'
import store from '../index'

const state = {
  token: '',
  menu: [],
  role: '',
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.data
        if (!data.error_code) {
          // 设置当前登录用户信息
          commit('SET_ROLE', data.is_supper)
          commit('SET_MENU', data.menu)
          // 设置权限菜单
          store.dispatch('permission/generateRoutes', { is_super: parseInt(data.is_supper), menu: data.menu })
          router.addRoutes(store.getters.permission_routes)
          // 设置当前登录用户信息
          const userInfo = data
          delete userInfo.menu
          commit('SET_USER_INFO', userInfo)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', '')
      commit('SET_MENU', [])
      resetRouter()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
