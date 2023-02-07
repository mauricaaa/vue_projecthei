<template>
    <div>
    <el-card class="box-card">
        <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加分类</el-button>
        </div>
        <!-- 分类数据表格 -->
            <el-table :data="cateList" style="width: 100%" border stripe>
                <!-- index是table-column内置属性，用index就是序号用索引值 -->
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="cate_name" label="分类名称"></el-table-column>
            <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
            <el-table-column label="操作">
                <!-- scope :{ row：行对象} -->
                <template v-slot="scope">
                    <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
    </el-card>

<!-- 对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%" @close="dialogCloseFn"
    >
    <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
    </span>
    </el-dialog>
        </div>
</template>

<script>
   // 如果要用同一个按钮 做状态区分
    // 1。 定义一个标识变量isEdit，还要定义本次要编辑的数据的id Editid
    //  2. 如果要修改 isEdit改为true ，editid改为要修改的id
    // 3. 如果要新增 ， isedit 改为false ，editid 置空
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'
export default {
    name: 'ArtCate',
    data () {
        return {
            cateList: [],
            dialogVisible: false, // 控制对话框出现或隐藏
            addForm: { // 添加表单的数据对象
                cate_name: '',
                cate_alias: ''
                },
            addRules: { // 添加表单的验证规则对象
                cate_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
                ],
                cate_alias: [
                    { required: true, message: '请输入分类别名', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
                ]
            },
            isEdit: false, // true为新增，false为修改
            editId: ''
        }
    },
    created () {
        this.getArtCateFn()
    },
    methods: {
        async getArtCateFn () {
            const res = await getArtCateListAPI()
            console.log(res)
            this.cateList = res.data.data
        },
        // 为了让对话框出现, 添加分类按钮
        addCateShowDialogFn () {
            this.isEdit = false
            this.editId = ''
            this.dialogVisible = true
        },
        confirmFn () {
            this.$refs.addRef.validate(async valid => {
                if (valid) {
                    if (this.isEdit) {
                        // 要修改
                        this.addForm.id = this.editId
                        const { data: res } = await updateArtCateAPI(this.addForm)
                        if (res.code !== 0) return this.$message.error('更新用户信息失败')
                        this.$message.success('更新成功')
                    } else {
                        // 新增
                        const { data: res } = await saveArtCateAPI(this.addForm)
                        if (res.code !== 0) return this.$message.error('更新用户信息失败')
                        this.$message.success('更新成功')
                    }

                    // 再重新请求一次文章列表，拿到新数据让表格更新
                    this.getArtCateFn()
                    this.dialogVisible = false
                } else {
                    return false
                }
            })
        },
        cancelFn () {
            this.dialogVisible = false
        },
        // 对话框关闭时的回调
        dialogCloseFn () {
            this.$refs.addRef.resetFields()
        },
        // 修改分类按钮
        updateCateBtnFn (obj) {
            this.isEdit = true
            this.editId = obj.id
            // obj的值 id cate_name cate_alias
            this.dialogVisible = true

            this.$nextTick(() => {
                // 数据回显
                this.addForm.cate_name = obj.cate_name
                this.addForm.cate_alias = obj.cate_alias
            })
        },
        async delCateFn (obj) {
            const { data: res } = await delArtCateAPI(obj.id)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
            this.getArtCateFn()
        }
    }
}

// 小小的bug 第一次进网页先点击修改再新增，新增对话框里有内容 ,原因对话框关闭时候的回调失效
</script>

<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
