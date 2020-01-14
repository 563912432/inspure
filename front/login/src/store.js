import Vue from 'vue'
import Vuex from 'vuex'
import { set } from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    adminLogin ({ commit }, data) {
      // 设置token
      set('YPJ-ACCESS-TOKEN', data.access_token)
      set('scope', 1)
    },
    orgLogin ({ commit }, data) {
      // 设置token
      set('YPJ-ACCESS-TOKEN', data.access_token)
      set('scope', 2)
    },
    studentLogin ({ commit }, data) {
      // 设置token
      set('YPJ-ACCESS-TOKEN', data.access_token)
      set('scope', 3)
    }
  }
})
