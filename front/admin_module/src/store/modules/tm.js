const state = {
  tmSmall: [],
  exam: {}
}

const mutations = {
  SAVE_TM(state, data) {
    state.tmSmall = data
  },
  SAVE_EXAM_INFO(state, data) {
    // 循环处理data
    for (var i in data) {
      state.exam[i] = data[i]
    }
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
