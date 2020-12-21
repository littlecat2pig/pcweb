<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!--  查找用户、添加用户    -->
      <div class="searchAddUser">
        <el-input :placeholder="tips" v-model="inputContent" class="searchUser">
          <el-select v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="用户名" value="user"></el-option>
            <el-option label="姓名" value="name"></el-option>
            <el-option label="角色" value="role"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="queryUsers"></el-button>
        </el-input>

        <el-button type="primary" @click="addUser" class="addUser">添加用户</el-button>
      </div>
      <!--   表格内容   -->
      <el-table
          :data="userList"
          border
          stripe
          style="width: 100%">
        <el-table-column type="index" width="80px"></el-table-column>
        <el-table-column prop="username" label="用户名" min-width="130px"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="125px"></el-table-column>
        <el-table-column prop="role" label="角色" min-width="125px"></el-table-column>
        <el-table-column label="操作" width="400px" class-name="opColumn">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" round mini @click="edit(scope.row.name)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" round mini @click="deleteUser(scope.row.name)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" round mini @click="setPermission(scope.row)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页   -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalUsers">
      </el-pagination>
    </el-card>

    <!--   添加用户对话框   -->
    <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogVisible"
        width="400px"
        :close-on-click-modal="false"
        @close="addUserReset"
        @open="getRoleList">
      <el-form label-position="left" label-width="70px" :model="newUser" :rules="newUserRules" ref="newUserRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newUser.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="newUser.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="newUser.role" placeholder="请选择">
            <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.label"
                :value="item.label">
            </el-option>
          </el-select>        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserCancel">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--   设置权限对话框   -->
    <el-dialog
        title="设置权限"
        :visible.sync="permissionSettingDialogVisible"
        width="400px"
        :close-on-click-modal="false"
        @open = "getRoleList">
      <div class="pSettingInfo"><span class="labelArea">用户名：</span>{{userInfo.username}}</div>
      <div class="pSettingInfo"><span class="labelArea">姓名：</span>{{userInfo.name}}</div>
      <div class="pSettingInfo"><span class="labelArea">角色：</span>
        <el-select v-model="newPermission">
          <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionSettingCancel">取 消</el-button>
        <el-button type="primary" @click="permissionSettingConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Users",
  data(){
    return{
      //用户数据，name--用户名，role--角色
      userList: {
        username: '',
        name: '',
        role: '',
      },
      newUser:{
        username: '',
        name: '',
        role: '',
      },
      newUserRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请选择角色', trigger: 'blur'}
        ]
      },
      //查找用户时选择的类型：用户名or角色
      selectType: '',
      //输入框提示语
      tips: '请输入内容',
      //保存输入框的内容
      inputContent: '',
      //添加用户对话框是否显示
      addUserDialogVisible: false,
      //权限设置对话框是否显示
      permissionSettingDialogVisible: false,
      //
      userInfo:{},
      newPermission: '',
      roleList:{},
      currentPage: 1,
      currentPageSize: 5,
      totalUsers: 0
    }
  },
  created() {
    //无服务器的模拟数据
    this.userList = [
      {username: 'zhangyixing', name: '张艺兴', role: '管理员'},
      {username: 'xiaozhan', name: '肖战', role: '审核员'},
      {username: 'wangyibo', name: '王一博', role: '测试员'}

    ];
    this.roleList = [
      {id: 0, label: '管理员'},
      {id: 1, label: '审核员'},
      {id: 2, label: '测试员'}
    ];

    //获取用户列表
    this.getUserList();
  },
  methods:{
    //向服务器请求用户列表
    getUserList(){

      this.totalUsers = this.userList.length;
    },
    //向服务器请求符合条件的用户列表
    queryUsers(){
      if(this.inputContent !== ''){
        const ret = {};
        const path ='';
        //TODO 调用不同的后台接口请求用户列表
        switch (this.selectType){
          case "username":
            break;
          case "name":
            break;
          case "role":
            break;
        }
        //TODO 判断后台接口是否调用成功，成功则将数据赋值给this.userList，失败则提示失败信息


      }else {

      }
    },
    addUser(){
      this.addUserDialogVisible = true;
    },
    getRoleList(){
      //向服务器请求获取最新的RoleList


    },
    //向服务器注册新用户
    addUserConfirm(){
      console.log(this.newUser.username);
      console.log(this.newUser.name);
      console.log(this.newUser.role);
      console.log(this.newUser);
      this.$refs.newUserRef.validate(valid => {
        if (valid){
          //TODO 调用后台接口添加用户

          //TODO 判断后台返回值，若添加成功，则提示成功并关闭对话框；否则提示添加失败

          this.$refs.newUserRef.resetFields();
          this.addUserDialogVisible = false;
        }
      })
    },
    addUserCancel(){
      this.$confirm('此操作将取消添加新用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.newUserRef.resetFields();
        this.addUserDialogVisible = false;
      }).catch(() => {});
    },
    addUserReset(){
      this.$refs.newUserRef.resetFields();
    },
    //编辑用户信息
    edit(userName){

    },
    //删除用户
    deleteUser(userName){

    },
    //为用户设置使用权限
    setPermission(userInfo){
      this.userInfo = userInfo;
      this.newPermission = userInfo.role;
      this.permissionSettingDialogVisible = true;
    },
    permissionSettingCancel(){
      this.$confirm('此操作将取消设置权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.permissionSettingDialogVisible = false;
      }).catch(() => {});
    },

    //设置权限
    permissionSettingConfirm(){
      console.log(this.userInfo.role);
      console.log(this.newPermission);

      //TODO 将新的权限发送到服务器进行保存，若成功则提示成功、关闭对话框、刷新表格
      //TODO 若不成功，则提示不成功
      this.$message.success('权限设置成功');
      this.permissionSettingDialogVisible = false;
    },

    //当每页显示的item数量变化时调用
    handleSizeChange(currentPageSize){
      console.log('currentPageSize: ' + currentPageSize);
      console.log('currentPage: ' + this.currentPage);
      console.log('currentPageSize: ' + this.currentPageSize);
      this.currentPageSize = currentPageSize;

      //TODO 将最新的页码和每页item数量传给后台，获取最新的当前待展示的数据列表
    },

    //当页码切换时调用
    handleCurrentChange(currentPage){
      console.log('currentPage: ' + currentPage);
      console.log('currentPage: ' + this.currentPage);
      console.log('currentPageSize: ' + this.currentPageSize);
      this.currentPage = currentPage;
      //TODO 将最新的页码和每页item数量传给后台，获取最新的当前待展示的数据列表
    }
  },
  watch:{
    //监听类型的变化，根据类型显示不同的提示语
    selectType: function () {
      if(this.selectType === 'user'){
        this.tips = '请输入用户名';
      }else if(this.selectType === 'name'){
        this.tips = '请输入姓名';
      }else if(this.selectType === 'role'){
        this.tips = '请输入角色';
      }
    }
  }
}
</script>

<style scoped>
.el-select{
  width: 100px;
}

.el-dialog__header{
  text-align: left;
}

.labelArea{
  width: 80px;
  display: inline-block;
  text-align: left;
  margin-bottom: 5px;
}

.pSettingInfo{
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 40px;
  cursor: default;
}

.searchAddUser{
  display: flex;
  justify-content: space-between;
}

.searchUser{
  width: 400px;
}

</style>