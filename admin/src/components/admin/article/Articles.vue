<template>
    <div>
        <h3 style="width: 100%; text-align: center; height: 30px; line-height: 30px; font-style: italic">
            文 章 管 理
        </h3>

        <!-- 文章列表区域 -->
        <a-card>
            <a-row :gutter="20">
                <a-col :span="6">
                    <a-input-search v-model="queryParams.query" @search="getArticleList" allowClear placeholder="输入文章名查找" enter-button  />
                </a-col>
                <a-col :span="6" :offset="4">
                    <a-select defaultValue="请输入分类" style="width: 200px" @change="getArticleByCategory">
                      <a-select-option v-for="item in catelist" :key="item.id">
                          {{item.name}}
                      </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-table :dataSource="articlelist" :columns="columns" rowKey="id" :pagination="paginationOption">
                <template slot="action" slot-scope="data">
                    <div class="action">
                        <a-button type="primary" size="small" icon="edit" style="margin-right: 15px;" @click="$router.push(`/admin/add-article/${data.id}`)">编辑</a-button>
                        <a-button type="danger" size="small" icon="delete" style="margin-right: 15px;" @click="deleteArticle(data.id)">删除</a-button>
                    </div>
                </template>
                <template slot="img" slot-scope="src">
                    <img :src="src" class="mini" />
                </template>
            </a-table>
        </a-card>

    </div>
</template>

<script>
const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "10%",
        align: "center"
    },
    {
        title: "分类",
        dataIndex: "categoryName",
        key: "categoryName",
        width: "20%",
        align: "center",
    },
    {
        title: "标题",
        dataIndex: "title",
        key: "title",
        width: "20%",
        align: "center"
    },
    {
        title: "简介",
        dataIndex: "summary",
        key: "summary",
        width: "20%",
        align: "center"
    },
    {
        title: "缩略图",
        dataIndex: "banner",
        key: "banner",
        width: "20%",
        align: "center",
        scopedSlots: {
            customRender: "img"
        }
    },
    {
        title: "操作",
        key: "action",
        width: "10%",
        scopedSlots: {
            customRender: "action"
        } ,
        align: "center"  
    }
]
export default {
    data() {
        return {
            paginationOption: {
                pageSizeOptions: ['2', '4', '10'],
                defaultPageSize: 4,
                defaultCurrent: 1,
                total: 0,
                showSizeChanger: true,
                showTotal: (total) => {return `共${total}条`},
                onChange: (page, pageSize) => {
                    this.queryParams.currentPage = page
                    this.queryParams.pageSize = pageSize
                    if(this.currentCategory == -1)
                        this.getArticleList()
                    else
                        this.getArticleByCategory(this.currentCategory)
                },
                onShowSizeChange: (current, size) => {
                    this.queryParams.currentPage = current
                    this.queryParams.pageSize = size
                    if(this.currentCategory == -1)
                        this.getArticleList()
                    else
                        this.getArticleByCategory(this.currentCategory)
                }
            },
            articlelist: [],
            catelist: [],
            currentCategory: -1,
            queryParams: {
                searchText: "",
                pageSize: 4,
                currentPage: 1,
                cid: -1
            },
            columns,
            articleInfo: {
                id: 0,
                title: "",
                cid: 0,
                summary: "",
                banner: ""
            },
        }
    },
    created() {
        this.getArticleList()
        this.getCateList()
    },
    methods: {
        async getArticleList() {
            const {data: data} = await this.$http.get('post/list', {params: this.queryParams})
            if(data.code != 200)
                return this.$message.error(data.message)
            this.articlelist = data.data
            this.paginationOption.total = this.articlelist.length
        },
        deleteArticle(ID) {
            this.$confirm({
                title: "确定要删除吗?",
                content: "一旦删除不可恢复",
                onOk: async () => {
                    const {data: data} = await this.$http.delete(`post/${ID}`)
                    if(data.code != 200)
                        return this.$message.error(data.message)
                    this.$message.success("删除成功")
                    this.getArticleList()
                },
                onCancel() {}
            })
        },
        async getCateList() {
            const {data: data} = await this.$http.get('category/list')
            if(data.code != 200)
                return this.$message.error(data.message)
            this.catelist = data.data
            this.catelist.splice(0, 0, {
                id: -1,
                name: "所有分类"
            })
        },
        async getArticleByCategory(cid) {
            this.currentCategory = cid
            const {data: data} = await this.$http.get('post/list', {params: {
                pageSize: this.queryParams.pageSize,
                currentPage: this.queryParams.currentPage,
                cid: cid
            }})
            if(data.code != 200)
                return this.$message.error(data.message)
            this.articlelist = data.data
            this.paginationOption.total = this.articlelist.length
        }
    }
}
</script>

<style scoped>
.action {
    display: flex;
    justify-content: center;
}

img.mini {
    width: 80px;
    height: 60px;
}

</style>