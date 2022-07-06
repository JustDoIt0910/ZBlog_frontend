<template>
    <div class="container">
        <div class="loginBox">
            <a-form-model ref="loginFormRef" :model="formdata" :rules="rules" class="loginForm">
                <a-form-model-item prop="username">
                    <a-input v-model="formdata.username" placeholder="请输入用户名">
                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-model-item>

                <a-form-model-item prop="password">
                    <a-input v-model="formdata.password" v-on:keyup.enter="login" placeholder="请输入密码" type="password">
                        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-model-item>

                <a-form-model-item class="loginBtn">
                    <a-button type="primary" style="margin:10px" @click="login">登录</a-button>
                    <a-button type="info" style="margin:10px" @click="reset">取消</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formdata: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    {required: true, message: "请输入用户名", trigger: "change"},
                    {min: 4, max: 12, message: "用户名应大于3位小于15位", trigger: "change"}
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "change"},
                    {min: 6, max: 20, message: "密码应大于6位小于20位", trigger: "change"}
                ]
            }
        }
    },
    methods: {
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if(!valid) return this.$message.error("输入不符合条件")
                const {data: data} = await this.$http.post("/user/login", this.formdata)
                if(data.code != 200) 
                    return this.$message.error(data.message)
                else {
                    window.localStorage.setItem('token', data.data)
                    this.$router.push('admin/dashboard')
                }
            })
        },
        reset() {
            this.$refs.loginFormRef.resetFields()
        }
    }
}
</script>>

<style scoped>
    .container {
        height: 100%;
        background-color: #282c34;
    }

    .loginBox {
        width: 350px;
        height: 300px;
        background-color: #fff;
        top: 50%;
        left: 70%;
        position: absolute;
        transform: translate(-50%, -50%);
        border-radius: 9px;
    }

    .loginForm {
        position: absolute;
        bottom: 10%;
        width: 100%;
        padding: 0 20px;
    }

    .loginBtn {
        display: flex;
        justify-content: flex-end;
    }
</style>