import Vuex from 'vuex'

export default Vuex.createStore({
    state: {
        count: 0
    },
    mutations: {
        increase(state, n) {
            state.count += n
        }
    },
    actions: {},
    modules: {},
});