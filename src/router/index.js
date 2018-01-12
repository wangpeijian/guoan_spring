import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Index = resolve => require(['../pages/Index'], resolve);

const routes = [{
    path: '/',
    meta: {},
    component: Index
},{
    path: '*',
    component: Index
},];

const router = new VueRouter({
    routes,
});

router.afterEach((to, from) => {

});

export default router
