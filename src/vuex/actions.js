
export const goToView = ({commit}, current) => {
    commit('Go_To_View', current)
}
export const goBackView = ({commit}) => {
    commit('Go_Back_View')
}
export const pushImageAction = ({commit}, para) => {
    commit("PUSH_IMAGE_ACTION", para)
}
export const addContext = ({commit}, current) => {
    commit('ADD_CONTEXT', current)
}
export const resetContext = ({commit}, current) => {
    commit('RESET_CONTEXT', current)
}
export const valset = ({commit}, para) => {
    commit('VAL_SET', para)
}

