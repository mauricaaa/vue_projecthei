import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来存储登录成功后获取到的token
    token: ''
  },
  getters: {
  },
  mutations: {
    // 更新token到mutation函数
    updateToken (state, val) {
        state.token = val
    }
  },
  actions: {
  },
  modules: {
  }
})
