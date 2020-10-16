<template>
    <div>
        <div v-show="!editFormVisible">
            <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-table :data="latestList" border style="width: 100%; margin: 10px 0">
                <el-table-column fixed type="index" label="序号" width="100" align="center"> </el-table-column>
                <el-table-column prop="banner" label="封面" align="center">
                    <template slot-scope="{ row }">
                        <img :src="row.banner" alt="" style="width: 100px" />
                        <!-- <img :src="`https://cdn.sspai.com/${row.banner}`" alt="" style="width: 100px" /> -->
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="description" label="描述" width="350"> </el-table-column>
                <el-table-column prop="price" label="价格(元)" width="120">
                    <template slot-scope="{ row }">
                        {{ (row.price / 100).toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="small" @click="edit(row)">编辑</el-button>
                        <el-button type="text" size="small" @click="remove(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <EditForm ref="editForm" v-show="editFormVisible" :visible.sync="editFormVisible" @saveSuccess="saveSuccess"></EditForm>
    </div>
</template>

<script>
import EditForm from '../../common/EditForm';
export default {
    name: 'SeriesLatest',
    data() {
        return {
            latestList: [],
            editFormVisible: false,
            dialogVisible: false,
        };
    },
    mounted() {
        this.getLatestList();
    },
    methods: {
        async getLatestList() {
            this.latestList = await this.$API.series.reqLatestList();
        },
        add() {
            this.editFormVisible = true;
        },
        edit(row) {
            // this.itemId = row.id;
            this.editFormVisible = true;
            this.$refs.editForm.getInitData(row);
        },
        remove(row) {
            this.$confirm(`确认要删除${row.title}吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    try {
                        const res = await this.$API.series.deleteLatestItem(row.id);
                        this.$message.success('删除成功');
                        this.getLatestList();
                    } catch (error) {
                        this.$message.error('请求失败 ' + error.message);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        saveSuccess() {
            this.getLatestList();
        }
    },
    components: {
        EditForm
    }
};
</script>

<style lang="less" scoped></style>
