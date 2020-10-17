<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAdd">添加商品</el-button>
        <el-table :data="settingList" style="margin: 20px 0" border>
            <el-table-column type="index" label="序号" width="80"> </el-table-column>
            <el-table-column prop="name" label="名字"> </el-table-column>
            <el-table-column prop="banner" label="图片">
                <template slot-scope="{ row, $index }">
                    <img :src="row.banner" alt="" style="width:80px;height:80px" />
                </template>
            </el-table-column>
            <el-table-column property="address" label="操作">
                <template slot-scope="{ row, $index }">
                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="showUpdate(row)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--dialog弹窗-->
        <el-dialog :title="form.id ? '修改品牌' : '添加品牌'" :visible.sync="isShowDialog">
            <el-form ref="form" :model="form" :rules="rules" style="width: 80%">
                <el-form-item label="商品名称" :label-width="'100px'" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="商品图片" :label-width="'100px'" prop="banner">
                    <el-upload
                        class="avatar-uploader"
                        action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="form.banner" :src="form.banner" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">
                            只能上传jpg/png文件，且不超过500kb
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Mall',
    data() {
        return {
            settingList: [],
            isShowDialog: false,
            form: {
                name: '',
                banner: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                banner: [{ required: true, message: '请上传商品图片', trigger: 'change' }]
            }
        };
    },
    mounted() {
        this.getSeetingLidt();
    },
    methods: {
        //获取数据
        async getSeetingLidt() {
            const result = await this.$API.order.getSeetingList();
            this.settingList = result;
            // console.log(result);
        },
        //点击弹出dialog
        showAdd() {
            this.isShowDialog = true;
            this.form = {};
        },

        // 图片成功过后
        handleAvatarSuccess(res, file) {
            // console.log(res, file)
            //把属性改成响应式属性
            this.$set(this.form, 'banner', res.data);
            this.form.banner = res.data;
            //强制刷新视图
            // this.$forceUpdate();
            // console.log(this.form);
            // console.log(res);
        },
        // 图片上传前

        beforeAvatarUpload(file) {
            const fileTypes = ['image/jpeg', 'image/png'];
            // 上传的图片是不是jpg格式
            const isJPG = fileTypes.indexOf(file.type) !== -1;
            // 上传图片的大小
            const isLt2M = file.size / 1024 < 500;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 或者PNG格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 500KB!');
            }
            return isJPG && isLt2M;
        },
        //点击添加或者修改
        save() {
            // 验证规则
            this.$refs.form.validate(async valid => {
                if (valid) {
                    // 获取参数
                    const trademark = this.form;
                    console.log('tarl' + trademark);
                    // 发送请求
                    try {
                        const result = await this.$API.order.addOrUpdate(trademark);
                        // 成功 关闭dialog
                        this.isShowDialog = false;
                        // 重新获取数据
                        this.getSeetingLidt(trademark.id);
                        // 提示添加成功信息
                        this.$message.success(`${trademark.id ? '修改' : '添加'}品牌成功`);
                    } catch (error) {
                        this.$message.error(error.message);
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //点击删除数据
        remove(row) {
            this.$confirm(`确定删除 ${row.name} 吗?`, '提示', {
                type: 'warning'
            })
                .then(async () => {
                    // 点击确定
                    const result = await this.$API.order.deleteMon(row.id);
                    // 如果成功了, 提示成功, 重新获取列表(哪一页?)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getSeetingLidt();
                })
                .catch(error => {
                    // 点击取消的回调
                    if (error === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    }
                });
        },
        //点击修改数据
        showUpdate(trademark) {
            this.form = { ...trademark };
            this.isShowDialog = true;
        }
    }
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
