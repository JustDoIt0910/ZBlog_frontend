<template>
    <div>
        <h3 style="width: 100%; text-align: center; height: 30px; line-height: 30px; font-style: italic">
            分 类 管 理
        </h3>

        <!-- 分类列表区域 -->
        <a-card>
            <a-row :gutter="20">
                <a-col :span="4">
                    <a-button type="primary" @click="addCate">新增</a-button>
                </a-col>
            </a-row>
            <a-table :dataSource="catelist" :columns="columns" rowKey="id">
                <template slot="action" slot-scope="data">
                    <div class="action">
                        <a-button type="danger" style="margin-right: 15px;" @click="deleteCate(data.id)">删除</a-button>
                    </div>
                </template>
            </a-table>
        </a-card>

        <!--新增分类区域-->
        <a-modal title="新增分类" :visible="addCateVisible"  @ok="addCateOK" @cancel="addCateCancel">
            <a-form-model :model="cateInfo" ref="addCateRef">
                <a-form-model-item has-feedback label="分类名称" prop="name">
                    <a-input v-model="cateInfo.name"></a-input>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
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
        dataIndex: "name",
        key: "name",
        width: "20%",
        align: "center"
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
            catelist: [],
            columns,
            addCateVisible: false,
            editCateVisible: false,
            cateInfo: {
                id: 0,
                name: ""
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const {data: data} = await this.$http.get('category/list')
            if(data.code != 200)
                return this.$message.error(data.message)
            this.catelist = data.data
        },
        deleteCate(ID) {
            this.$confirm({
                title: "确定要删除吗?",
                content: "一旦删除不可恢复",
                onOk: async () => {
                    const {data: data} = await this.$http.delete(`category/${ID}`)
                    if(data.code != 200)
                        return this.$message.error(data.message)
                    this.$message.success("删除成功")
                    this.getCateList()
                },
                onCancel() {}
            })
        },
        addCate() {
            this.addCateVisible = true
        },
        async addCateOK() {
            const {data: data} = await this.$http.post("category/add", {
                name: this.cateInfo.name
            })
            if(data.code != 200) {
                this.$message.error(data.message)
            }
            else {
                this.addCateVisible = false
                this.$refs.addCateRef.resetFields()
                this.$message.success("添加成功")
                this.getCateList()
            }
        },
        addCateCancel() {
            this.addCateVisible = false
            this.$refs.addCateRef.resetFields()
        }
    }
}
</script>

<style scoped>
.action {
    display: flex;
    justify-content: center;
}


</style>