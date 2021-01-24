import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 购物车数量
        shopabagCount: 0,
        // 是否加载
        isLoadShopbagCont: false
    },
    mutations: {
        changeShopbagCount(state, data) {
            state.shopabagCount = data

        },
        changeIsLoadShopbagCont(state) {
            state.isLoadShopbagCont = true
        }
    },
    actions: {},
    modules: {}
})