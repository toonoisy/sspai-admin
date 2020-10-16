<template>
    <el-card>
        <el-form label-position="right" label-width="100px" :v-model="itemInfo">
            <el-form-item label="标题">
                <el-input v-model="itemInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" rows="4" v-model="itemInfo.description"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input type="number" v-model="itemInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="免费试读(章)">
                <el-input type="number" v-model="itemInfo.probation_total"></el-input>
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
                <el-button type="primary" @click="save" :disabled='!itemInfo.title || !itemInfo.description || !itemInfo.price'>保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'EditForm',
    data() {
        return {
            // inputPrice: '',
            imageUrl: '',
            itemInfo: {
                title: '',
                description: '',
                price: '',
                banner: '',
                probation_total: ''
            }
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.itemInfo.banner = res.data
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
          this.getItemInfoById(item.id)
        },
        async getItemInfoById(id) {
          let res = await this.$API.series.reqLatestItem(id)
          console.log(res);
          this.itemInfo = {
            ...res,
            // 为了显示符合要求
            price: res.price / 100
          }
        },
        async save() {
            const res = await this.$API.series.saveLatestItem({...this.itemInfo, price: this.itemInfo.price * 100});  // 为了传值符合要求
            this.$emit('update:visible', false);
            this.$emit('saveSuccess');
            this.resetData();
        },
        cancel() {
            this.$emit('update:visible', false);
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
