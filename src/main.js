/* eslint-disable */
// // // // // with polyfills
// // import 'core-js/stable'
// // import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import './utils/prototype'
import {
    VueAxios
} from './utils/request'
// // mock
// // WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './utils/filter' // global filter
import './components/global.less'
import './css/reset.less'
import './mycomponents/index'
import queryString from 'query-string'
import * as utils from './utils/index';
console.log(queryString.parseUrl('https://foo.bar?foo=bar#aaa'));
console.log(utils.deepClone({
    a: 1,
    b: 2
}))
Vue.config.productionTip = false
// var validator = new schema(descriptor);
// mount axios Vue.$http and this.$http
Vue.use(VueAxios);

new Vue({
    router,
    store,
    created: bootstrap,
    render: h => h(App)
}).$mount('#app')

// // // // import * as utils from './utils/index'

// // // // let tree = [{
// // // //     id: '1',
// // // //     text: '北京',
// // // //     children: [{
// // // //         id: '2',
// // // //         text: '北京市',
// // // //         children: [{
// // // //             id: '3',
// // // //             text: '西城区',
// // // //             children: null
// // // //         }, {
// // // //             id: '4',
// // // //             text: '东城区',
// // // //             children: null
// // // //         }]
// // // //     }]
// // // // }, {
// // // //     id: '5',
// // // //     text: '上海',
// // // //     children: [{
// // // //         id: '6',
// // // //         text: '上海市',
// // // //         children: [{
// // // //             id: '7',
// // // //             text: '黄浦区',
// // // //             children: null
// // // //         }]
// // // //     }]
// // // // }];

// // // // var obj = {
// // // //     'id': '4',
// // // //     'left': {
// // // //         'id': '2',
// // // //         'left': {
// // // //             'id': '1',
// // // //             'left': null,
// // // //             'right': null
// // // //         },
// // // //         'right': {
// // // //             'id': '3',
// // // //             'left': null,
// // // //             'right': null
// // // //         }
// // // //     },
// // // //     'right': {
// // // //         'id': '7',
// // // //         'left': {
// // // //             'id': '6',
// // // //             'left': null,
// // // //             'right': null
// // // //         },
// // // //         'right': {
// // // //             'id': '9',
// // // //             'left': null,
// // // //             'right': null
// // // //         }
// // // //     }
// // // // }

// // // // var invertTree = function (root) {
// // // //     // 判断当前树是否为 null
// // // //     if (root == null) return root;
// // // //     // 左右子树结点交换
// // // //     let right = root.right;
// // // //     let left = root.left;
// // // //     root.right = left;
// // // //     root.left = right;
// // // //     // 分别对左右子树进行递归
// // // //     invertTree(left);
// // // //     invertTree(right);
// // // //     // 返回树的根节点
// // // //     return root;
// // // // };

// // // async function a() {
// // //     console.log(999);
// // //     return 9
// // // }
// // // console.log(a() + 1);

// // // async function async1() {
// // //     console.log('async1 start'); // 1
// // //     await async2();
// // //     console.log('async1 end'); // 4
// // // }

// // // async function async2() {
// // //     // console.log('async2'); // 2
// // //     return new Promise((resolve) => {
// // //         console.log('async2');
// // //         resolve(1);
// // //     })
// // // }

// // // async1();

// // // console.log('script end'); // 3

// // async function async1() {
// //     // console.log('async1 start');
// //     let b = await async2();
// //     console.log(b);
// //     // console.log('async1 end');
// // }

// // async function async2() {
// //     return new Promise(function (resolve) {
// //         // console.log('async2');
// //         // setTimeout(() => {
// //         resolve(111);
// //         // }, 0)
// //     })
// //     // console.log('async2');
// //     // return '111';
// // }
// // // console.log('script start');
// // // setTimeout(function () {
// // //     console.log('setTimeout');
// // // }, 0);
// // async1();
// // // new Promise(function (resolve) {
// // //     console.log('promise1');
// // //     resolve();
// // // }).then(function () {
// // //     console.log('promise2');
// // // });
// // // console.log('script end');

// // let groupJobs = [{
// //         "outParams": [{
// //             "stageParam": "sd",
// //             "pluginParam": "md5"
// //         }],
// //         "buildStrategies": [{
// //             "strategyOutParams": [{
// //                 "stageParam": "sd1"
// //             }]
// //         }]
// //     },
// //     {
// //         "outParams": undefined,
// //         "buildStrategies": [{
// //             "strategyOutParams": [{
// //                 "stageParam": "sd2"
// //             }]
// //         }]
// //     }
// // ];

// // let a = [].concat(..._.map(groupJobs, (item) => {
// //     return [].concat(_.map(item.outParams, (item2) => {
// //         return item2.stageParam;
// //     }), ..._.map(item.buildStrategies, (item2) => {
// //         return [..._.map(item2.strategyOutParams, (item3) => {
// //             return item3.stageParam;
// //         })];
// //     }));
// // }))
// // console.log(a);

// let internalValue = [{
//     "strategyOutParams": [{
//         "stageParam": "111"
//     }]
// }, {
//     "strategyOutParams": [{
//         "stageParam": "222"
//     }]
// }]

// function fn(value, index, ci) {
//     const changed = {
//         ...internalValue[index].strategyOutParams[ci],
//         stageParam: value
//     }

//     const newValue = {
//         ...internalValue[index],
//         strategyOutParams: [...internalValue[index].strategyOutParams.slice(0, ci), changed, ...internalValue[index].strategyOutParams.slice(ci + 1)],
//     };
//     return {
//         internalValue: [...internalValue.slice(0, index), newValue, ...internalValue.slice(index + 1)],
//     };
// }

// console.log(fn(1, 0, 0));