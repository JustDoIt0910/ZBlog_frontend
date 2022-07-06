<template>
    <a-layout-sider breakpoint="lg" v-model="collapsed">
        <div class="logo">{{collapsed ? "Blog" : "My Blog" }}</div>
        <a-menu theme="dark" mode="inline" @click="gotoPage">
          <a-menu-item key="dashboard">
              <a-icon type="dashboard" />
              <span>仪表盘</span>
          </a-menu-item>

          <a-sub-menu>
            <span slot="title">
                <a-icon type="file" />
                <span>文章管理</span>
            </span>
            <a-menu-item key="add-article">
                <a-icon type="form" />
                <span>写文章</span>
            </a-menu-item>
            <a-menu-item key="articles">
                <a-icon type="snippets" />
                <span>文章列表</span>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item key="categories">
              <a-icon type="tags" />
              <span>分类列表</span>
          </a-menu-item>

          <a-menu-item key="users">
              <a-icon type="user" />
              <span>用户列表</span>
          </a-menu-item>

        </a-menu>
    </a-layout-sider>
</template>  

<script>
export default {
    data() {
        return {
            collapsed: false
        }
    },
    methods: {
        gotoPage(item) {
            this.$router.push('/admin/' + item.key)
        }
    }
}
</script>

<style scoped>
.logo {
    margin-top: 20px;
    text-align: center;
    color: #eee;
    font-style: italic;
    font-size: 20px;
}
</style>