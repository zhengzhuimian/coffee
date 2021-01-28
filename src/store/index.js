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
        // 判断是否要加载
        changeIsLoadShopbagCont(state, data) {
            state.isLoadShopbagCont = data
        },
        // 删除减去购物车数量-1
        removeshopabagCount(state) {
            state.shopabagCount--;
        }
    },
    actions: {},
    modules: {}
})