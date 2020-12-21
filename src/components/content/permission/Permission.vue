<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table
          :data="permissionData"
          border
          stripe
          style="width: 100%">
        <el-table-column type="index" width="100px"></el-table-column>
        <el-table-column prop="name" label="权限名称"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template  slot-scope="scope">
            <el-tag v-if="scope.row.level === 1" color="#F5CEC7" style="color: #FF414D">一级</el-tag>
            <el-tag v-else-if="scope.row.level === 2" color="#FFDD95" style="color: #EE9C6C">二级</el-tag>
            <el-tag v-else color="#D0E6A5" style="color: #80BEAF">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Permission",
  data(){
    return{
      permissionData:{
        name: '',
        level: 0
      }
    }
  },
  created() {
    this.permissionData = [
      {name: '管理员', level: 1},
      {name: '审核员', level: 2},
      {name: '测试员', level: 3}
    ]
  },
  methods:{

  }
}
</script>

<style scoped>

</style>