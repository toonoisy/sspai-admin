import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: 'sspai系统首页' }
                },
                {
                    path: '/home',
                    component: () => import(/* webpackChunkName: "home" */ '../components/page/Home.vue'),
                    meta: { title: 'Home' }
                },
                {
                    path: '/matrix',
                    component: () => import(/* webpackChunkName: "matrix" */ '../components/page/Matrix.vue'),
                    meta: { title: 'Matrix' }
                },
                {
                    path: '/series',
                    component: () => import(/* webpackChunkName: "series" */ '../components/page/Series.vue'),
                    meta: { title: 'Series' }
                },
                {
                    path: '/mall',
                    component: () => import(/* webpackChunkName: "mall" */ '../components/page/Mall.vue'),
                    meta: { title: 'Mall' }
                },
                {
                    path: '/topics',
                    component: () => import(/* webpackChunkName: "topics" */ '../components/page/Topics.vue'),
                    meta: { title: 'Topics' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
