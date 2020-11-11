<template>
    <div>
        <div v-show="!editFormVisible">
            <el-button type="primary" icon="el-icon-plus" @click="add">{{ $t('add') }}</el-button>
            <el-button type="info" @click="toggleLang">{{ $t('lang') }}</el-button>
            <el-table :data="latestList" border style="width: 100%; margin: 10px 0">
                <el-table-column fixed type="index" :label="$t('no')" width="100" align="center"> </el-table-column>
                <el-table-column prop="banner" :label="$t('cover')" align="center">
                    <template slot-scope="{ row }">
                        <img :src="row.banner" alt="" style="width: 100px" />
                        <!-- <img :src="`https://cdn.sspai.com/${row.banner}`" alt="" style="width: 100px" /> -->
                    </template>
                </el-table-column>
                <el-table-column prop="title" :label="$t('title')"> </el-table-column>
                <el-table-column prop="description" :label="$t('description')" width="350"> </el-table-column>
                <el-table-column prop="price" :label="$t('price')" width="120">
                    <template slot-scope="{ row }">
                        {{ (row.price / 100).toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="$t('panel')">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="small" @click="edit(row)">{{ $t('edit') }}</el-button>
                        <el-button type="text" size="small" @click="remove(row)">{{ $t('del') }}</el-button>
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
            dialogVisible: false
        };
    },
    mounted() {
        this.getLatestList();
    },
    methods: {
        toggleLang() {
            this.$confirm(this.$t('tip'), this.$t('warning'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            })
                .then(() => {
                    let locale = this.$i18n.locale;
                    // console.log('1', locale);
                    locale === 'zh-CN' ? (this.$i18n.locale = 'en-US') : (this.$i18n.locale = 'zh-CN');
                    // console.log('2', this.$i18n.locale);
                    localStorage.setItem('locale', this.$i18n.locale);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('msg')
                    })
                });
        },
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
