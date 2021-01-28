// Main二级路由
const MainRouets = [{
    path: '/home',
    alias: '/',
    name: 'Home',
    component: () =>
        import ('../views/Home.vue')
}, {
    path: '/menu',
    name: 'Menu',
    component: () =>
        import ('../views/Menu.vue')
}, {
    path: '/shopbag',
    name: 'Shopbag',
    component: () =>
        import ('../views/Shopbag.vue')
}, {
    path: '/my',
    name: 'My',
    component: () =>
        import ('../views/My.vue')
}]
export const routes = [{
        path: '/',
        name: 'Main',
        component: () =>
            import ('../views/Main.vue'),
        // 二级路由
        children: MainRouets
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/detail/:pid',
        name: 'Detail',
        component: () =>
            import ('../views/Detail.vue')
    },
    {
        path: '/addressList',
        name: 'AddressList',
        component: () =>
            import ('../views/AddressList.vue')
    },
    {
        path: '/address',
        name: 'Address',
        component: () =>
            import ('../views/Address.vue')
    },
]