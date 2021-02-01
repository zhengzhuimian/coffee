import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

import 'lib-flexible/flexible'

Vue.config.productionTip = false
    // vant
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
    AddressEdit,
    Icon,
    Tab,
    Tabs,
    Uploader,
    Cell,
    CellGroup
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
    .use(Icon)
    .use(Tab)
    .use(Tabs)
    .use(Uploader)
    .use(Cell)
    .use(CellGroup)

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

// 定义全局过滤器 日期
Vue.filter('formatDate', (data, format) => {
    // data是要过滤的对象
    // format格式
    let date = new Date(data)

    let year = date.getFullYear().toString()
        // 年份
    if (/(y+)/.test(format)) {
        let yearContent = RegExp.$1;
        format = format.replace(yearContent, year.slice(year.length - yearContent.length))
    }

    // 月日时分秒
    let dateObject = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    }

    // 替换月日时分秒格式
    for (let key in dateObject) {
        let reg = new RegExp(`(${key}+)`)
        if (reg.test(format)) {
            let content = RegExp.$1;
            format = format.replace(content, dateObject[key] >= 10 ?
                dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key])
        }
    }
    return format
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')