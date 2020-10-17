<template>
  <div>
    <el-card v-show="!showAdd">
      <el-button type="success" icon="el-icon-plus" size="medium " style="margin-bottom:20px" @click="addTopics">添加</el-button>
       <el-table style="width: 100%;margin-botton:20px" border  :data="topicsList" align='center' >
      <el-table-column label="序号" type= index width="80" align='center'></el-table-column>
      <el-table-column label="图片" width="width" align='center'>
      <template slot-scope="scope">
        <img :src="scope.row.banner" alt="" style="height:40px;width:80px">
      </template>
    </el-table-column>
    <el-table-column label="题目" width="width" prop="title" align='center'>
    </el-table-column>
    <el-table-column label="操作" align='center'>
      <template slot-scope="{row,$index}">
        <el-button
          size="mini"
          type="primary"
          @click="handleEdit(row)">编辑</el-button>
         <el-button
          size="mini"
          type="info"
          @click="handleLook(row)">查看</el-button>
          <el-popconfirm
          title="确认删除吗" @onConfirm="handleDelete(row)">
          <el-button
          size="mini"
          type="danger"
          slot="reference"
          style="margin-left:10px"
          >删除</el-button>
          </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
    <!-- 子组件添加和修改页面 -->
      <topicsForm v-show="showAdd" :visible.sync="showAdd" ref="topicsForm" ></topicsForm>
    <!-- 弹出dailog -->
    <el-dialog title="查看话题" :visible.sync="isShow"  :before-close="handleBeforeClose">
    <el-table :data="topics">
        <el-table-column prop="title" label="题目"></el-table-column>
        <el-table-column prop="favorite_count" label="关注量"></el-table-column>
        <el-table-column prop="intro" label="介绍"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.banner" alt style="width:100px;height:80px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import topicsForm from '../common/topicsForm'
export default {
  name: 'Topics', 
  components:{
      topicsForm
  },
  data() {
    return {
      topicsList:[],
      topics:[],
      isShow:false,
      imageUrl:'',
      showAdd:false,
      currentTopics:''
    }
  },
  mounted(){
    this.getTopicsList()
  },
  methods:{
  async  getTopicsList(){
       const result = await this.$API.getTopicsList()
        this.topicsList = result
    },
  //  添加话题
  async addTopics(){
      this.showAdd = true
      // let topics = this.topics
      // const result = await this.$API.addTopics(topics)
      // this.getTopicsList()
    },
//  修改
  async handleEdit(row){
     this.showAdd = true 
    this.$refs.topicsForm.getCurrentTopics(row)
   },
  //  查看
  async handleLook(row){
      this.isShow = true
      //  发请求获取对应的id的话题
      const result = await this.$API.getTopicsOne(row.id)
      // Object.keys(result).forEach((item)=>{
      //   this.topics.push(result[item])
      // })
      this.topics.push(result)
   },
//  关闭dailog之前
  handleBeforeClose(){
       this.topics = [];
      this.isShow = false;
},
  // 删除
  async handleDelete(row){
   const result = await this.$API.del(row.id)
      this.getTopicsList()
    }
  },
  watch: {
    showAdd(val){
       if(val === false){
         this.getTopicsList()
       }
    }
  },

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