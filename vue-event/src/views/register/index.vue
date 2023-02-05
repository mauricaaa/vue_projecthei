<template>
    <!-- 注册页面的整体盒子 -->
        <div class="reg-container">
            <!-- 注册的盒子 -->
            <div class="reg-box">
                <!-- 标题的盒子 -->
            <div class="title-box"></div>
                <!-- 表单内容 -->
                <el-form ref="form" :model="form" :rules="rulesObj" >
                    <el-form-item prop="username">
                        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" >
                        <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="repassword" >
                        <el-input type="password" placeholder="请再次输入密码" v-model="form.repassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="btn-reg" type="primary" @click="registerFn">注册</el-button>
                        <el-link type="info" @click="$router.push('/login')">请登录</el-link>
                    </el-form-item>
                </el-form>
        </div>
    </div>
</template>

<script>
import { registerAPI } from '@/api'
export default {
    name: 'my-register',
    data () {
        // 此箭头函数的使用参考elementUI官网的表单自定义验证
        const samePwd = (rule, value, callback) => {
        if (value !== this.form.password) {
            // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
            callback(new Error('两次输入的密码不一致!'))
        } else {
            // 如果验证成功，则直接调用 callback 回调函数即可。
            callback()
        }
        }
        return {
        // 注册表单的数据对象
        form: {
            username: '',
            password: '',
            repassword: ''
        },
        // 注册表单的验证规则对象
        rulesObj: {
            username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
                pattern: /^[a-zA-Z0-9]{1,10}$/,
                message: '用户名必须是1-10的大小写字母数字',
                trigger: 'blur'
            }
            ],
            password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
                pattern: /^\S{6,15}$/,
                message: '密码必须是6-15的非空字符',
                trigger: 'blur'
            }
            ],
            repassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' },
            { validator: samePwd, trigger: 'blur' }
            ]
        }
        }
    },
    methods: {
        registerFn () { // js兜底校验
            this.$refs.form.validate(async valid => {
                if (valid) {
                    // 通过校验拿到绑定的数据
                    console.log(this.form)
                    // 调用注册接口,这里是解构赋值，把axios返回的数据保存在res上
                    const { data: res } = await registerAPI(this.form)
                    console.log(res)
                    // 注册失败提示用户，elementui在vue原型链上添加了弹窗提示message属性
                    if (res.code !== 0) return this.message.error(res.message)
                    // 注册成功
                    this.$message.success(res.message)
                    // 跳转到登录页面
                    this.$router.push('/login')
                    registerAPI(this.form)
                } else {
                    return false // 阻止默认提交行为
                }
            })
        }
    }
}

</script>

<style lang="less" scoped>
    .reg-container {
    background: url("../../assets/images/login_bg.jpg") center;
    background-size: cover;
    height: 100%;

    .reg-box {
        width: 400px;
        height: 335px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0 30px;
        box-sizing: border-box;

        .title-box {
            height: 60px;
            background: url("../../assets/images/login_title.png") center no-repeat;
        }

        .btn-reg {
            width: 100%;
        }
    }
}
</style>
