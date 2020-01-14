const state = {
  info: {}
}

const mutations = {
  SAVE_MESSAGE: (state, name) => {
    state.info = name
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
