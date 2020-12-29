import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'
import {
    stopInterception
} from '@/utils/util'
import {
    removeAllPending
} from '@/utils/request'
import {
    constantRouterMap,
    asyncRouterMap
} from '@/config/router.config'

// 关闭router的push，replace的promise校验
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function repalce(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap.concat(asyncRouterMap)
});

router.beforeEach((to, from, next) => {
    removeAllPending();
    stopInterception();
    if (_.get(from, 'meta.intercept')) {
        // 浏览器后退的时候
        if (confirm('系统可能不会保存您所做的更改，是否离开当前页面？')) {
            next();
        }
    } else {
        next()
    }
})

export default router;