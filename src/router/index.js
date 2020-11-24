import Vue from 'vue'
import VueRouter from 'vue-router'
import ca from "element-ui/src/locale/lang/ca";
import el from "element-ui/src/locale/lang/el";

Vue.use(VueRouter)

const Login = () => import('@/components/Login');
const Home = () => import('@/components/Home');

const routes = [
  {
    path: '/',
    redirect: '/login'
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
  switch (to.path) {
    case '/login':
      next();
      break;
    case '/home':
      const tokenStr = true; //window.sessionStorage.getItem('token');
      if(!tokenStr){
        next('/login');
      }else{
        next();
      }
  }
})

export default router
