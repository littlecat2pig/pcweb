<template>
  <el-header>
    <div>
      <img src="~assets/img/rabbit.jpg" alt="">
      <span>电商平台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script>
export default {
  name: "MainHeader",
  methods:{
    /*退出登录*/
    logout(){
      /*清空token，即清除权限*/
      window.sessionStorage.clear();
      /*跳转到登录页面*/
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.el-header{
  background-color: #80BEAF;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
}

.el-header div{
  display: flex;
  align-items: center;
}
.el-header img{
  height: 50px;
  width: 50px;
}

.el-header span{
  margin-left: 10px;
}
</style>