<template>
  <el-container class="home-container" direction="vertical">
    <!--头部区域-->
      <main-header></main-header>
      <main-menu></main-menu>
    <!--内容主体-->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import MainHeader from "@/components/content/MainHeader"
import MainMenu from '@/components/content/MainMenu'

export default {
  name: "Home",
  components:{
    MainHeader,
    MainMenu
  },
}
</script>

<style scoped>
 .home-container{
  height: 100%;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>