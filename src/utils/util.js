import _ from 'lodash'

export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
    const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
    let timer = 0
    let beforeScrollTop = window.pageYOffset
    callback = callback || function () {}
    window.addEventListener(
        'scroll',
        event => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                let direction = 'up'
                const afterScrollTop = window.pageYOffset
                const delta = afterScrollTop - beforeScrollTop
                if (delta === 0) {
                    return false
                }
                direction = delta > 0 ? 'down' : 'up'
                callback(direction)
                beforeScrollTop = afterScrollTop
            }, 50)
        },
        false
    )
}

export function isIE() {
    const bw = window.navigator.userAgent
    const compare = (s) => bw.indexOf(s) >= 0
    const ie11 = (() => 'ActiveXObject' in window)()
    return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
    if (id === '') {
        return
    }
    setTimeout(() => {
        document.body.removeChild(document.getElementById(id))
    }, timeout)
}

/**
 * 深度遍历，去前后空格
 * @param {Object} data
 * @param {Bollean} deep 是否深层次遍历
 */
export function trimObject(data, deep = true) {
    _.forEach(data, (item, key) => {
        if (_.isString(item)) {
            data[key] = _.trim(item)
        } else if (_.isObject(item)) {
            deep && trimObject(item)
        }
    })
}

/**
 * 跳转到指定位置
 * @param {String} query
 */
export function scrollIntoView(query) {
    const labelNode = document.querySelector(query)
    if (labelNode) {
        labelNode.scrollIntoView({
            block: 'center'
        })
    }
}

function rollbackInterception(e) {
    e.preventDefault();
    e.returnValue = '';
}

/**
 * 开启拦截策略，浏览器关闭的时候，会有二次确认
 */
export function startInterception(e) {
    window.addEventListener('beforeunload', rollbackInterception)
}

/**
 * 关闭拦截策略
 */
export function stopInterception(e) {
    window.removeEventListener('beforeunload', rollbackInterception)
}

/**
 * 判断是否超出有省略号
 * @param {*} el
 * @returns {Bollean}
 */
export function checkOverflow(el) {
    const curOverflow = el.style.overflow
    if (!curOverflow || curOverflow === 'visible') {
        el.style.overflow = 'hidden'
    }
    const isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight
    el.style.overflow = curOverflow
    return isOverflowing
}

export function isJSON(str) {
    if (!Object.prototype.toString.call(str) === '[object String]') return false;

    str = str.replace(/\s/g, '').replace(/\n|\r/, '');

    if (/^\{(.*?)\}$/.test(str)) {
        return /"(.*?)":(.*?)/g.test(str);
    }
    if (/^\[(.*?)\]$/.test(str)) {
        return str.replace(/^\[/, '')
            .replace(/\]$/, '')
            .replace(/},{/g, '}\n{')
            .split(/\n/)
            .map(function (s) {
                return isJSON(s);
            })
            .reduce(function (prev, curr) {
                return !!curr;
            });
    }
    return false;
}