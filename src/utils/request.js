import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import {
    VueAxios
} from './axios'
import {
    ACCESS_TOKEN
} from '@/store/mutation-types'
import {
    trimObject
} from '@/utils/util'
// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL // api base_url
    // timeout: 6000 // 请求超时时间
})

const pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识

// 清除指定的pending接口
const removePending = (ever) => {
    for (const p in pending) {
        if (pending[p].u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
            pending[p].f(); // 执行取消操作
            pending.splice(p, 1); // 把这条记录从数组中移除
        }
    }
}

// 清除所有的pending接口
const removeAllPending = (ever) => {
    pending.forEach((item, index) => {
        item.f()
        delete pending[index]
    });
}

const err = (error) => {
    if (error.response) {
        const data = error.response.data
        const token = Vue.ls.get(ACCESS_TOKEN)
        if (error.response.status === 403) {
            notification.error({
                message: 'Forbidden',
                description: data.message
            })
        }
        if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
            notification.error({
                message: 'Unauthorized',
                description: 'Authorization verification failed'
            })
            if (token) {
                store.dispatch('Logout').then(() => {
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                })
            }
        }
    }
    return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
        config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }

    // 设置参数的默认值
    config.trim = _.get(config, 'trim', true);
    config.allowSamePending = _.get(config, 'allowSamePending', true);

    config.trim && trimObject(config.data);

    if (config.method === 'get') {
        config.params = config.data;
    }

    removePending(config); // 在一个ajax发送前执行一下取消操作

    if (config.allowSamePending) {
        config.cancelToken = new axios.CancelToken((c) => {
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            pending.push({
                u: config.url + '&' + config.method,
                f: c
            });
        });
    }
    return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
    removePending(response.config);
    return response.data
}, err);

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    }
}

export {
    installer as VueAxios,
    service as axios,
    removeAllPending
}