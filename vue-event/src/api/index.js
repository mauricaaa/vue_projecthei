import request from '@/utils/request'
// import store from '@/store' // 引入store对象

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

export const getUserInfoAPI = () => {
    return request({
        url: '/my/userinfo'
        // method不写就是默认get方式
        // 请求头
        // headers: {
        //     // 此处应该请求的是token，但token保存在vuex中，而此处是js文件，不是组件对象，不能用this.$store.state.token
        //     Authorization: store.state.token
        // }
    })
}

export const getMenusListAPI = () => {
    return request({
        url: '/my/menus'
        // headers: {
        //     Authorization: store.state.token
        // }
    })
}

export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
    return request({
        url: '/my/userinfo',
        method: 'PUT',
        data: {
            id,
            username,
            nickname,
            email,
            user_pic
        }
    })
}

export const updateUserAvatarAPI = (avatar) => {
    return request({
        url: '/my/update/avatar',
        method: 'PATCH',
        data: {
            avatar // 头像base64字符串
        }
    })
}

export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
    return request({
        url: '/my/updatepwd',
        method: 'PATCH',
        data: {
            old_pwd,
            new_pwd,
            re_pwd
        }
    })
}
