import dayjs from 'dayjs'

/**
 * 树转数组扁平化结构   
 * 广度优先遍历  堆栈  先进先出
 */
export function treeTransArray(tree, childKey = 'children') {
    let stack = tree,
        data = [];
    while (stack.length != 0) {
        let temp = stack.shift();
        data.push(temp);
        let children = temp[childKey];
        if (children) {
            for (let i = 0; i <= children.length - 1; i++) {
                stack.push(children[i]);
            }
        }
    }
    return data;
}

/**
 * 将数组转化为tree
 * @param {Array} arr  
 * @param {String} parentKey
 * @param {String} childKey 
 * @return {Array}
 */
export function translateDataToTree(arr, parentKey, childKey) {
    let parents = arr.filter(value => value[parentKey] == 'undefined' || value[parentKey] == null);
    let children = arr.filter(value => value[parentKey] !== 'undefined' && value[parentKey] != null);
    let translator = (parents, children) => {
        parents.forEach((parent) => {
            children.forEach((current, index) => {
                if (current[parentKey] === parent[childKey]) {
                    let temp = JSON.parse(JSON.stringify(children));
                    temp.splice(index, 1);
                    typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current];
                    translator([current], temp);
                }
            })
        })
    }
    translator(parents, children);
    return JSON.parse(JSON.stringify(parents));
}

/**
 * 根据id获取路径
 * @param {Array} arr 
 * @param {String} key 
 * @param {String} value 
 * @return {Array} 
 */
export function getPathByKey(arr, key, value) {
    let temppath = []
    try {
        function getNodePath(node) {
            temppath.push(node);
            if (node[key] === value) {
                throw ("GOT IT!");
            }
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    getNodePath(node.children[i]);
                }
                temppath.pop();
            } else {
                temppath.pop();
            }
        }
        for (let i = 0; i < arr.length; i++) {
            getNodePath(arr[i]);
        }
    } catch (e) {
        return temppath;
    }
}

/**
 * 根据id获取树结构的某一项，广度优先
 * @param {*} tree 
 * @param {*} id 
 */
export function deepQuery(tree, id) {
    let stark = [];
    stark = stark.concat(tree);
    while (stark.length) {
        let temp = stark.shift();
        if (temp.children) {
            stark = temp.children.concat(stark);
        }
        if (id === temp.id) {
            return temp;
        }
    }
}

/**
 * 根据id获取树结构的某一项，深度优先
 * @param {*} tree 
 * @param {*} id 
 */
export function breadthQuery(tree, id) {
    var stark = [];
    stark = stark.concat(tree);
    while (stark.length) {
        var temp = stark.shift();
        if (temp.children) {
            stark = stark.concat(temp.children);
        }
        if (temp.id === id) {
            return temp;
        }
    }
}

/**
 * 并发度函数
 * @param {Array} list 
 * @param {Function} fetch 
 * @param {Number} limit 
 */
export function mapLimit(list, fetch, limit) {
    let fn = (arr) => {
        return fetch(arr.shift())
            .then(() => {
                if (arr.length != 0) return fn(arr)
            })
    }
    let asyncList = []
    while (limit--) {
        asyncList.push(fn(list))
    }
    return Promise.all(asyncList)
}

/**
 * localstorage带过期时间
 * @param {String} key  
 * @param {String} value 
 * @param {Object} limit 
 */
export function setLocalStorage(key, value, option = {}) {
    if (!option.expires) {
        throw new Error('第三个参数，过期时间不能为空');
    }
    localStorage.setItem(key, value);
    localStorage.setItem(key + '__expires', dayjs().add(option.expires, 'day').format());
}

/**
 * localstorage带过期时间
 * @param {String} key
 */
export function getLocalStorage(key) {
    if (dayjs().isBefore(dayjs(localStorage.getItem(key + '__expires')))) {
        return localStorage.getItem(key);
    } else {
        localStorage.removeItem(key);
        localStorage.removeItem(key + '__expires');
        return null;
    }
}

/**
 * localstorage带过期时间
 * @param {String} key
 */
export function removeLocalStorage(key) {
    if (dayjs().isBefore(dayjs(localStorage.getItem(key + '__expires')))) {
        return localStorage.getItem(key);
    } else {
        localStorage.removeItem(key);
        localStorage.removeItem(key + '__expires');
        return null;
    }
}

export function deepClone(targetObj) {
    let type = Object.prototype.toString.call(targetObj);
    let newObj;
    if (type === "[object Object]") {
        newObj = {};
    } else if (type === "[object Array]") {
        newObj = [];
    } else {
        return targetObj;
    }
    for (let key in targetObj) {
        let value = targetObj[key];
        newObj[key] = deepClone(value);
    }
    return newObj;
}