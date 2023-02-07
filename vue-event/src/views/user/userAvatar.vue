<template>
    <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>更换头像</span>
    </div>
    <div>
        <!-- 图片，用来展示用户选择的头像 -->
        <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
        <img v-else class="the_img" :src="avatar" alt="">

        <!-- 按钮区域 -->
        <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
        </div>
    </div>
    </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
    name: 'UserAvatar',
    data () {
    return {
        avatar: '' // 保存图片链接地址或者base64字符串
    }
    },
    methods: {
        chooseImg () {
            this.$refs.iptRef.click()
        },
        onFileChange (e) { // e 事件原生对象
            let files = e.target.files // 拿到用户选择的文件数组
            if (files.length === 0) {
                // 证明刚刚文件选择窗口打开了，但是一个文件都没选择就点确定
            } else {
                // 文件选择了一个
                console.log(files[0])
                // img的src只能是图片链接地址或者图片的base64字符串
                // this.avatar = URL.createObjectURL(files[0]) 文件->内存临时地址
                let fr = new FileReader() // 文件转为base64
                fr.readAsDataURL(files[0]) // 传入文件开始读
                fr.onload = e => { // onload等待把文件转成base64会触发onload事件函数
                    this.avatar = e.target.result // 读完的结果
                }
            }
        },
        async uploadFn () {
            const { data: res } = await updateUserAvatarAPI(this.avatar)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
            // 更新左上角的头像，让vuex里actions再请求一次后台，更新vuex里的头像的值
            this.$store.dispatch('getUserInfoActions')
        }
    }
}
</script>

<style lang="less" scoped>
.btn-box {
    margin-top: 10px;
}
.preview {
    object-fit: cover;
}
.the_img{
    width: 350px;
    height: 350px;
}
</style>
