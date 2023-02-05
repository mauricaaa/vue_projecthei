import request from '@/utils/request'

export const registerAPI = (obj) => {
    return request({
        url: '/api/reg',
        method: 'POST',
        // axios传参有两种参数，params和data
        // params对象参数名和值，axios会把参数和值 拼接在url？后传给后台 （query查询参数）
        // data对象，axios会把参数和值拼接在请求体里（body参数）
        // data: {
        //     username: username,
        //     password: password,
        //     repassword: repassword
        // }
        data: obj
    })
}

/**
 * 登录接口
 * @param {*} param0 {username ,password}
 * @returns promise对象
 */
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/api/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}
