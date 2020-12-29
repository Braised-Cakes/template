import Vue from 'vue'
import {
    startInterception,
    stopInterception
} from '@/utils/util'

/**
 * 开启拦截策略，浏览器关闭的时候，会有二次确认
 */
Vue.prototype.$startInterception = function () {
    this.$route.meta.intercept = true;
    startInterception();
}

Vue.prototype.$stopInterception = function () {
    this.$route.meta.intercept = false;
    stopInterception();
}