const state = {
  editCourseState: 0
}

const mutations = {
  SAVE_EDIT_COURSE_STATE: (state, data) => {
    state.editCourseState = data
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
