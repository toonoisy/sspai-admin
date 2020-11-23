<template>
    <el-card>
        <el-form label-position="right" label-width="100px" :model="itemInfo" :rules="rules" ref="ruleForm">
            <el-form-item label="标题" prop="title">
                <el-input v-model="itemInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input type="textarea" rows="4" maxlength="100" v-model="itemInfo.description"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)" prop="price">
                <el-input type="number" v-model.number="itemInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="免费试读(章)">
                <el-input type="number" v-model.number="itemInfo.probation_total"></el-input>
            </el-form-item>
            <el-form-item label="封面">
                <el-upload
                    class="avatar-uploader"
                    action="/dev-api/admin/product/fileUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="itemInfo.banner" :src="itemInfo.banner" class="avatar" />
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <!-- <el-button type="primary" @click="save" :disabled="!itemInfo.title || !itemInfo.description || !itemInfo.price"
                    >保存</el-button
                > -->
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'EditForm',
    data() {
        let validPrice = (rule, value, callback) => {
            if (value <= 0) {
                callback(new Error('有效价格必须大于0'));
            } else {
                callback(); // 自定义校验 callback 必须被调用
            }
        };
        return {
            // inputPrice: '',
            imageUrl: '',
            itemInfo: {
                title: '',
                description: '',
                price: '',
                banner: '',
                probation_total: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'change' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'change' },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
                ],
                price: [
                    { required: true, type: 'number', message: '请输入价格', trigger: 'change' },
                    { required: true },
                    { validator: validPrice, trigger: 'change' }
                ]
            }
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.itemInfo.banner = res.data;
        },
        beforeAvatarUpload(file) {
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isPNG) {
                this.$message.error('上传图片只能是 PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isPNG && isLt2M;
        },
        getInitData(item) {
            //   this.getItemInfoById(item.id)
            this.itemInfo = { ...item, price: item.price / 100 }; // 浅拷贝一个新对象并对price做处理
        },
        // async getItemInfoById(id) {
        //   let res = await this.$API.series.reqLatestItem(id)
        //   console.log(res);
        //   this.itemInfo = {
        //     ...res,
        //     // 为了显示符合要求
        //     price: res.price / 100
        //   }
        // },
        save() {
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    const res = await this.$API.series.saveLatestItem({ ...this.itemInfo, price: this.itemInfo.price * 100 }); // 为了传值符合要求
                    this.$emit('update:visible', false);
                    this.$emit('saveSuccess');
                    // 对整个验证表单进行重置，将所有字段值重置为初始值并移除校验结果
                    this.$refs.ruleForm.resetFields();
                    this.resetData();
                }
            });
        },
        cancel() {
            this.$emit('update:visible', false);
            this.$refs.ruleForm.resetFields();
            this.resetData();
        },
        resetData() {
            this.imageUrl = '';
            this.itemInfo = {
                title: '',
                description: '',
                price: '',
                banner: '',
                probation_total: ''
            };
        }
    }
};
</script>

<style>
.el-upload--text {
    width: 180px;
}
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
