<template>
    <div>
        <h3 style="width: 100%; text-align: center; height: 30px; line-height: 30px; font-style: italic">
            用 户 管 理
        </h3>

        <!-- 用户列表区域 -->
        <a-card>
            <a-row :gutter="20">
                <a-col :span="6">
                    <a-input-search v-model="queryParams.query" @search="getUserList" allowClear placeholder="输入用户名查找" enter-button  />
                </a-col>
                <a-col :span="4">
                    <a-button type="primary" @click="addUser">新增</a-button>
                </a-col>
            </a-row>
            <a-table :dataSource="userlist" :columns="columns" rowKey="ID" :pagination="paginationOption">
                <span slot="role" slot-scope="role">{{role == 1 ? '管理员' : '订阅者'}}</span>
                <template slot="action" slot-scope="data">
                    <div class="action">
                        <a-button type="primary" style="margin-right: 15px;" @click="editUser(data.ID)">编辑</a-button>
                        <a-button type="danger" style="margin-right: 15px;" @click="deleteUser(data.ID)">删除</a-button>
                    </div>
                </template>
            </a-table>
        </a-card>

    <!--新增用户区域-->
    <a-modal title="新增用户" :visible="addUserVisible"  @ok="addUserOK" @cancel="addUserCancel">
        <a-form-model :model="userInfo" :rules="userRules" ref="addUserRef">
            <a-form-model-item has-feedback label="用户名" prop="username">
                <a-input v-model="userInfo.username"></a-input>
            </a-form-model-item>

            <a-form-model-item has-feedback label="密码" prop="password">
                <a-input-password v-model="userInfo.password"></a-input-password>
            </a-form-model-item>

            <a-form-model-item has-feedback label="确认密码" prop="confirm">
                <a-input-password v-model="userInfo.confirm"></a-input-password>
            </a-form-model-item>

            <a-form-model-item label="权限">
                <a-select default-value="2" style="width: 120px" @change="adminChange">
                    <a-select-option key=1 value=1>管理员</a-select-option>
                    <a-select-option key=2 value=2>订阅者</a-select-option>
                </a-select>
            </a-form-model-item>
        </a-form-model>
    </a-modal>

    <!--编辑用户区域-->
    <a-modal title="编辑用户" :visible="editUserVisible"  @ok="editUserOK" @cancel="editUserCancel">
        <a-form-model :model="userInfo" :rules="userRules" ref="editUserRef">
            <a-form-model-item has-feedback label="用户名" prop="username">
                <a-input v-model="userInfo.username"></a-input>
            </a-form-model-item>

            <a-form-model-item label="权限">
                <a-select default-value="2" style="width: 120px" @change="adminChange">
                    <a-select-option key=1 value=1>管理员</a-select-option>
                    <a-select-option key=2 value=2>订阅者</a-select-option>
                </a-select>
            </a-form-model-item>
        </a-form-model>
    </a-modal>

    </div>
</template>

<script>
const columns = [
    {
        title: "ID",
        dataIndex: "ID",
        key: "id",
        width: "10%",
        align: "center"
    },
    {
        title: "用户名",
        dataIndex: "username",
        key: "username",
        width: "20%",
        align: "center"
    },
    {
        title: "权限",
        dataIndex: "role",
        key: "role",
        width: "20%",
        scopedSlots: {
            customRender: "role"
        },
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
            paginationOption: {
                pageSizeOptions: ['2', '4', '10'],
                defaultPageSize: 4,
                defaultCurrent: 1,
                total: 0,
                showSizeChanger: true,
                showTotal: (total) => {return `共${total}条`},
                onChange: (page, pageSize) => {
                    this.queryParams.pageNum = page
                    this.queryParams.pageSize = pageSize
                    this.getUserList()
                },
                onShowSizeChange: (current, size) => {
                    this.queryParams.pageNum = current
                    this.queryParams.pageSize = size
                    this.getUserList()
                }
            },
            userlist: [],
            queryParams: {
                query: "",
                pageSize: 4,
                pageNum: 1
            },
            columns,

            addUserVisible: false,
            editUserVisible: false,
            userInfo: {
                id: 0,
                username: "",
                password: "",
                confirm: "",
                role: 2
            },
            userRules: {
                username: [
                    {required: true, message: "请输入用户名", trigger: "change"},
                    {min: 4, max: 12, message: "用户名应大于3位小于15位", trigger: "change"}
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "change"},
                    {min: 6, max: 20, message: "密码应大于6位小于20位", trigger: "change"}
                ],
                confirm: [
                    {required: true, message: "请确认密码", trigger: "change"},
                    {
                        validator: (rule, value, callback) => {
                            if(this.userInfo.password != this.userInfo.confirm)
                                callback(new Error("两次密码不一致"))
                            else 
                                callback()
                        },
                        trigger: "change"
                    }
                ]
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const {data: data} = await this.$http.get('users', {params: this.queryParams})
            if(data.code != 200)
                return this.$message.error(data.msg)
            this.userlist = data.data
            this.paginationOption.total = data.total
        },
        deleteUser(ID) {
            this.$confirm({
                title: "确定要删除吗?",
                content: "一旦删除不可恢复",
                onOk: async () => {
                    const {data: data} = await this.$http.delete(`user/${ID}`)
                    if(data.code != 200)
                        return this.$message.error(data.msg)
                    this.$message.success("删除成功")
                    this.getUserList()
                },
                onCancel() {}
            })
        },
        addUser() {
            this.addUserVisible = true
        },
        async editUser(ID) {
            this.userInfo.id = ID
            const {data: data} = await this.$http.get(`user/${ID}`)
            console.log(data)
            this.userInfo.username = data.data.username
            this.userInfo.role = data.data.role
            this.editUserVisible = true
        },
        addUserOK() {
            this.$refs.addUserRef.validate(async (valid) => {
                if(valid) {
                    const {data: data} = await this.$http.post("user/add", {
                        username: this.userInfo.username,
                        password: this.userInfo.password,
                        role: this.userInfo.role
                    })
                    if(data.code != 200) {
                        this.$message.error(data.msg)
                    }
                    else {
                        this.addUserVisible = false
                        this.$refs.addUserRef.resetFields()
                        this.$message.success("添加成功")
                        this.getUserList()
                    }
                }
                else 
                    return this.$message.error("输入不符合条件")
            })
        },
        editUserOK() {
            this.$refs.editUserRef.validate(async (valid) => {
                if(valid) {
                    const {data: data} = await this.$http.put(`user/${this.userInfo.id}`, {
                        username: this.userInfo.username,
                        password: this.userInfo.password,
                        role: this.userInfo.role
                    })
                    if(data.code != 200) {
                        this.$message.error(data.msg)
                    }
                    else {
                        this.editUserVisible = false
                        this.$refs.editUserRef.resetFields()
                        this.$message.success("修改成功")
                        this.getUserList()
                    }
                }
                else 
                    return this.$message.error("输入不符合条件")
            })
        },
        addUserCancel() {
            this.addUserVisible = false
            this.$refs.addUserRef.resetFields()
        },
        editUserCancel() {
            this.editUserVisible = false
            this.$refs.editUserRef.resetFields()
        },
        adminChange(value) {
            this.userInfo.role = value
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