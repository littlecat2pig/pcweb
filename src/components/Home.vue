<template>
<div>
  <h2>首页</h2>
  <el-button type="info" @click="logout">退出</el-button>
</div>
</template>

<script>
export default {
  name: "Home",
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

</style>