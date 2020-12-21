import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('@/components/Login');
const Home = () => import('@/components/Home');
const Welcome = () => import('@/components/Welcome');
const CreateReport = () => import('@/components/content/report/CreateReport');
const Users = () => import('components/content/permission/Users');
const Permission = () => import('@/components/content/permission/Permission');
const Roles = () => import('@/components/content/permission/Roles');

const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', name: 'Welcome', component: Welcome},
      {path: '/users', name: 'Users', component: Users},
      {path: '/create', name: 'CreateReport', component: CreateReport},
      {path: '/permission', name: 'Permission', component: Permission},
      {path: '/roles', name: 'Roles', component: Roles},
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/*
* 路由导航守卫：当某个界面需要权限才可以访问时，要根据权限跳转不同的界面
* to:将要访问的路径
* from: 从哪个路径跳转而来
* next: 放行函数，next()----直接放行， next('/home')-----强制跳转
*/
router.beforeEach((to, from, next) => {
  console.log(to.path);
  switch (to.path) {
    case '/login':
      next();
      break;
//    case '/home':
    default:
      const tokenStr = true; //window.sessionStorage.getItem('token');
      if(!tokenStr){
        next('/login');
      }else{
        next();
        console.log("jump to next");
      }
  }
})

export default router
