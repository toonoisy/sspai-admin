<template>
<!-- 添加话题页面 -->
  <div>
     <el-card>
       <el-form :model="form" :rules="rules" ref='form'>
          <el-form-item label="作者：" label-width="100px" prop="author">
            <el-input placeholder="请输入作者名字" v-model="form.author"></el-input>
          </el-form-item>

         <el-form-item label="话题名称：" label-width="100px" prop="title">
            <el-input placeholder="话题名称" v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="话题图片：" label-width="100px" prop="banner">
            <el-upload
            class="avatar-uploader"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.banner" :src="form.banner" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          </el-form-item>
      
          <el-form-item label="话题介绍：" label-width="100px" prop="intro">
            <el-input placeholder="话题介绍："    type="textarea"
            rows="4" v-model="form.intro"></el-input>
          </el-form-item>

          <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>

       </el-form>
     </el-card>
  </div>
</template>

<script>
export default {
  name: 'topicsForm',
  data() {
    return {
      form:{
        author:'',
        intro:"",
        title: "",
        banner:'',
        favorite_count:Math.floor(Math.random() * (100 - 1 + 1) + 1)
      },
       rules: {
          author: [
            { required: true, message: "请输入作者名", trigger: "blur"  }
          ],
          banner: [
            {  required: true, message: "请上传话题LOGO", trigger: "change" }
          ],
          title: [
            { required: true, message: "请输入话题名", trigger: "blur" },
            { min: 2, max: 20, message: "长度在 2 到 10 个字符", trigger: "change"}
          ],
          intro:[{required: true, message: "请输入话题描述", trigger: "blur"}]
        }
    }
  },
  methods:{
      cancel(){
          //  通知父组件关闭页面
      this.$emit("update:visible", false);
      this.form = {
        intro:"",
        title: "",
        banner:'',
        favorite_count:Math.floor(Math.random() * (100 - 1 + 1) + 1)
       }
      },
      //   点击保存
     async save(){
        let {form} = this
      //  判断id，如果有id就是编辑后的保存
      if (form.id) {
        //  如果id存在
        this.$API.updateTopics(form.id,form)
        this.$message.success('修改成功')
         //  通知父组件关闭页面
        this.$emit("update:visible", false);
      }else{
        this.$refs.form.validate( async valid =>{
         if (valid) {
          const result = await this.$API.addTopics(form)
          this.$message.success('保存成功')
         }else{
           return false;
         }
        })
      }
       this.form = {
        intro:"",
        title: "",
        banner:'',
        favorite_count:Math.floor(Math.random() * (100 - 1 + 1) + 1)
       }
          //  得到父组件的方法，发请求从新获取页面数据
       this.$parent.getTopicsList()
   },

     handleAvatarSuccess(res, file) {
         this.form.banner = res.thumbUrl
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
   
   // 接收父组件传递过来的id，获取对应的数据展示，修改之后保存
   async getCurrentTopics(row){
      const result = await this.$API.getTopicsOne(row.id)
      this.form  = result
    }
   
   
   }
}
</script>

<style lang="less" scoped>
     .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
