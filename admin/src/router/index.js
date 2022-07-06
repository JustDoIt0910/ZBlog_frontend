import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Dashboard from '../components/admin/Dashboard.vue'
import Users from '../components/admin/user/Users.vue'
import Categories from '../components/admin/category/Categories.vue'
import AddArticle from '../components/admin/article/AddArticle.vue'
import Articles from '../components/admin/article/Articles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'users', component: Users},
      {path: 'categories', component: Categories},
      {path: 'add-article', component: AddArticle},
      {path: 'add-article/:id', component: AddArticle, props: true},
      {path: 'articles', component: Articles},
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path == "/login")
    next()
  const token = window.localStorage.getItem('token')
  if(!token && to.path == "/admin")
    next("/login")
  else 
    next()
})

export default router
