<template>
  <el-menu
      :default-active="activePath"
      mode="horizontal"
      background-color="#B3DDD1"
      text-color="#fff"
      active-text-color="#fff"
      unique-opened
      router>
    <!--从服务器请求菜单数据-->
<!--
    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <span>{{item.menuName}}}</span>
      </template>

      <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
        <template slot="title">
          <span>{{subItem.menuName}}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
-->
    <el-submenu index="1" :show-timeout='0' :hide-timeout='0'>
      <template slot="title">
        <span>报告</span>
      </template>

      <el-menu-item index="/create" @click="saveNavState('/create')">
        <span>创建报告</span>
      </el-menu-item>
      <el-menu-item index="/edit" @click="saveNavState('/edit')">
        <span>编辑报告</span>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="2" :show-timeout='0' :hide-timeout='0'>
      <template slot="title">
        <span>流程</span>
      </template>

      <el-submenu index="2-2" :show-timeout='0' :hide-timeout='0'>
        <template slot="title">
          <span>A流程</span>
        </template>
        <el-menu-item index="/A-a">
          <span>A-a</span>
        </el-menu-item>
        <el-menu-item index="/b">
          <span>A-b</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/edit" @click="saveNavState('/edit')">
        <template slot="title">
          <span>B流程</span>
        </template>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="3" :show-timeout='0' :hide-timeout='0'>
      <template slot="title">
        <span>权限管理</span>
      </template>

      <el-menu-item index="/users" @click="saveNavState('/users')">
        <span>用户列表</span>
      </el-menu-item>
<!--      <el-menu-item index="/permission" @click="saveNavState('/permission')">
        <span>菜单列表</span>
      </el-menu-item>-->
      <el-menu-item index="/roles" @click="saveNavState('/roles')">
        <span>权限设置</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "MainMenu",
  created() {
/*
    this.getMenuList();
*/
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  data(){
    return{
      activePath: '',
//      menuList: []
    }
  },
  methods:{
/*
    getMenuList(){
      this.$http.get('').then(result => {
        if(result.data.meta.status === 200){
          this.menuList = result.data;
        }else{
          this.$message.error(result.data.msg || "出现错误，请稍后再试");
        }
        result.data
      }).catch(error => {
        this.$message.error(error || "出现错误，请稍后再试");
      })
    },
*/
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  }
}
</script>

<style>
.el-submenu__title{
  border-bottom-color: transparent !important;
}
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
  border-bottom: 0;
}
.el-submenu.is-active .el-submenu__title{
  border-bottom-color: transparent;
}
.el-menu--horizontal>.el-submenu .el-submenu__title{
  border-bottom: 0;
}
.el-submenu__title:hover{
  background-color: #08979D !important;
}
.el-menu-item:hover {
  background-color: #08979D !important;
}
.el-submenu .el-menu-item{
  min-width: 150px;
}
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 150px;
}
/*依次展开菜单的背景色*/
.el-submenu.is-opened .el-submenu__title{
  background-color: #08979D !important;
}
</style>