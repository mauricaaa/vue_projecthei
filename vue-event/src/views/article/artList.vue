<template>
    <div>
        <!-- 内容区 -->
    <el-card class="box-card">
        <div slot="header" class="clearfix">
        <span>文章列表</span>
        </div>
        <!-- 搜索区域 -->
        <div class="search-box">
        <el-form :inline="true" :model="q">
            <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
                <el-option v-for="obj in cateList " :key="obj.id" :label="obj.cate_name" :value="obj.cate_id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
                <el-option label="已发布" value="已发布"></el-option>
                <el-option label="草稿" value="草稿"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
        </div>

        <!-- 文章表格区域 -->

        <!-- 分页区域 -->
    </el-card>

        <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @close="dialogCloseFn">

        <!-- 发布文章的对话框 -->
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
            <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                <el-option v-for="obj in cateList " :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
            <!-- 用来显示封面的图片 -->
            <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
            <br />
            <!-- 文件选择框，默认被隐藏 -->
            <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="changeCoverFn"/>
            <!-- 选择封面的按钮 -->
            <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
                <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI } from '@/api'
import imgObj from '../../assets/images/cover.jpg'
export default {
    name: 'ArtList',
    data () {
    return {
        // 查询参数对象
        q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
        },
        pubDialogVisible: false, // 控制对话框
        // ...其他
        pubForm: { // 表单的数据对象
            title: '', // 文章标题
            cate_id: '', // id
            content: '', // 内容
            cover_img: '', // 封面图片文件
            state: '' // 发布状态
        },
        pubFormRules: { // 表单的验证规则对象
            title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
            ],
            cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
            // 富文本编辑器不是elUI内置的，没有change和blur两种事件，需要自己绑定@change进行校验
            content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
            cover_img: [{ required: true, message: '请输入图片', trigger: 'blur' }]
        },
        cateList: [] // 保存文章分类列表
        }
    },
    created () {
        // 请求分类数据
        this.getCateListFn()
    },
    methods: {
        // 发布文章按钮点击事件
        showPubDialogFn () {
            this.pubDialogVisible = true
        },
        // 发布文章对话框关闭前的回调
        async handleClose (done) { // done调用才会关闭对话框
       // 询问用户是否确认关闭对话框
            const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 取消了关闭-阻止住, 什么都不干
            if (confirmResult === 'cancel') return
            // 确认关闭
            done()
        },
        async getCateListFn () {
            const { data: res } = await getArtCateListAPI()
            this.cateList = res.data
        },
        selCoverFn () {
            this.$refs.iptFileRef.click()
        },
        changeCoverFn (e) {
            const files = e.target.files
            if (files.length === 0) {
                this.pubForm.cover_img = null
                // this.$refs.imgRef.setAttribute('src', '../../assets/images/cover.jpg')
                // 标签和样式中引入图片文件可以直接写路径，在js里引入图片要用import引入
                this.$refs.imgRef.setAttribute('src', imgObj)
            } else {
                this.pubForm.cover_img = files[0]
                const url = URL.createObjectURL(files[0])
                this.$refs.imgRef.setAttribute('src', url)
            }
            this.$refs.pubFormRef.validateField('cover_img')
        },
        pubArticleFn (str) {
            this.pubForm.state = str
            this.$refs.pubFormRef.validate(async valid => {
                if (valid) {
                    console.log(this.pubForm)
                    let fd = new FormData() // 专门为了装文件内容和其他参数的容器
                    // fd.append(‘参数名’，值)
                    fd.append('title', this.pubForm.title)
                    fd.append('cate_id', this.pubForm.cate_id)
                    fd.append('content', this.pubForm.content)
                    fd.append('cover_img', this.pubForm.cover_img)
                    fd.append('state', this.pubForm.state)

                    const { data: res } = await uploadArticleAPI(fd)
                    if (res.code !== 0) return this.$message.error('发布文章失败')
                    this.$message.success('发布成功')
                    this.pubDialogVisible = false
                } else {
                    return false
                }
            })
        },
        contentChangeFn () {
            // 富文本编辑器内容改变触发该内容
            this.$refs.pubFormRef.validateField('content')
        },
        // 发表文章对话框关闭时清空表单
        dialogCloseFn () {
            this.$refs.pubFormRef.resetFields()
            this.$refs.imgRef.setAttribute('src', imgObj)
        }
    }
}
</script>

//  scope只会给当前组件的原生标签添加data-v-hash属性,还会给组件标签内的根标签添加
<style lang="less" scoped>
.search-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .btn-pub {
    margin-top: 5px;
    }
}

.cover-img {
    width: 400px;
    height: 280px;
    object-fit: cover;
}

   // 设置富文本编辑器的默认最小高度
   // ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
   // 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
   // [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
    min-height: 300px;
}
</style>
