import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

import 'lib-flexible/flexible'

Vue.config.productionTip = false
import {
    NavBar,
    Field,
    Button,
    Popup,
    Tabbar,
    TabbarItem,
    Search,
    Swipe,
    SwipeItem,
    Stepper,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Checkbox,
    CheckboxGroup,
    SwipeCell,
    SubmitBar,
    List,
    Toast,
    Empty,
    AddressList,
    AddressEdit
} from 'vant';
Vue
    .use(NavBar)
    .use(Field)
    .use(Button)
    .use(Popup)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(SwipeItem)
    .use(Swipe)
    .use(Stepper)
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(SwipeCell)
    .use(SubmitBar)
    .use(List)
    .use(Toast)
    .use(Empty)
    .use(AddressList)
    .use(AddressEdit)

Vue.use(VueAxios, axios)
Vue.use(VueCookies)

// 请求axios之前的拦截器
axios.interceptors.request.use(config => {
    // console.log(config.data)


    if (config.method === 'post') {
        let paramsString = ''
        for (let key in config.data) {
            // console.log(config.data[key])
            paramsString += `${key}=${config.data[key]}&`;
        }
        config.data = paramsString.slice(0, -1)
            // console.log(paramsString)
    }
    return config
})

//将请求路径和appkey存放在原型属性里
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002'
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')