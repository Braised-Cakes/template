import {
    axios
} from '@/utils/request'

const api = {
    user: '/user',
    role: '/role',
    service: '/service',
    // service: 'https://randomuser.me/api',
    permission: '/permission',
    permissionNoPager: '/permission/no-pager',
    orgTree: '/org/tree',
    del: '/api/del'
}

export default api

export function getUserList(parameter) {
    return axios({
        url: api.del,
        method: 'get',
        data: parameter
    })
}

export function getRoleList(parameter) {
    return axios({
        url: api.role,
        method: 'get',
        data: parameter
    })
}

export function getServiceList(parameter) {
    return axios({
        url: api.service,
        method: 'get',
        data: parameter
    })
}

export function getPermissions(parameter) {
    return axios({
        url: api.permissionNoPager,
        method: 'get',
        data: parameter
    })
}

export function getOrgTree(parameter) {
    return axios({
        url: api.orgTree,
        method: 'get',
        data: parameter
    })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
    return axios({
        url: api.service,
        method: parameter.id === 0 ? 'post' : 'put',
        data: parameter
    })
}

export function aaa(parameter) {
    return axios({
        url: '/api/xxx',
        method: 'post',
        data: parameter
    })
}