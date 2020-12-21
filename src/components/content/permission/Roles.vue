<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限设置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--   添加角色按钮   -->
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="addRole">添加角色</el-button>
      </div>

      <!--   数据展示表格   -->
      <el-table
          :data="rolesList"
          border
          stripe
          style="width: 100%">

        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- item1:第一级菜单项， index1：第一级菜单项的index -->
            <el-row :class="['fp-bottom', index1===0?'fp-top':'', 'vcenter']" v-for="(item1, index1) in scope.row.permission" :key="item1.id">
              <el-col :span="6">
                <el-tag type="success">{{item1.menuName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <!-- item2:第二级菜单项， index2：第二级菜单项的index -->
                <el-row :class="[index2===0?'':'sp-top', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="8">
                    <el-tag type="warning">{{item2.menuName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <!-- item3:第三级菜单项， index3：第三级菜单项的index -->
                    <el-tag type="danger" v-for="(item3, index3) in item2.children" :key="item3.id">
                      {{item3.menuName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="100px"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="130px"></el-table-column>
        <el-table-column prop="description" label="角色描述" min-width="240px"></el-table-column>
        <el-table-column label="操作" width="400px" class-name="opColumn">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" round @click="editRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" round @click="deleteRole(scope.row.name)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" round @click="permissionUpdate(scope.row.permission)">权限修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  添加角色对话框  -->
    <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        :close-on-click-modal="false"
        width="30%"
        @close="addRoleReset">
      <el-form :model="newRole" :rules="newRoleRules" ref="newRoleRef" label-width="100px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="newRole.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入角色描述"
              v-model="newRole.description">
          </el-input>
        </el-form-item>
        <el-form-item label="权限设置" prop="value">
          <el-input v-model="newRole.value" @focus="permissionAllot"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewRoleConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  权限设置对话框  -->
    <el-dialog
        title="设置权限"
        :visible.sync="permissionSettingDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        @close="resetPermissionSettingDialog">
      <el-tree
          :data="menuList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
          ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionSettingDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="permissionSettingConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--  角色编辑对话框  -->
    <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisible"
        :close-on-click-modal="false"
        width="30%"
        @close="resetEditRoleDialog">
      <el-form :model="currentRole" :rules="editRoleRules" ref="editRoleRef" label-width="100px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="currentRole.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入角色描述"
              v-model="currentRole.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleCancel">取 消</el-button>
        <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  角色删除消息提示框  -->

  </div>
</template>

<script>
export default {
  name: "Roles",
  data(){
    return{
      rolesList:{
        name: '',
        description: '',
        permission: []
      },
      addRoleDialogVisible: false,
      newRole: {
        name: '',
        description: '',
        value: '',
        permission: []
      },
      newRoleRules:{
        name:[
          {required: true, message: '请输入角色名', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ],
        value: [
          {required: true, message: '请设置权限', trigger: 'change'}
        ]
      },
      permissionSettingDialogVisible: false,
      menuList: [],
      defaultCheckedKeys: [],
      selectedCheckedKeys: [],
      editRoleDialogVisible: false,
      currentRole: {},
      editRoleRules:{
        name:[
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        description:[
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.rolesList = [
      {
        name: '管理员',
        description: '拥有所有操作权限',
        permission:[
          {id: 1, menuName: '报告', children: [{id: 2, menuName: '创建报告'}, {id: 3, menuName: '编辑报告'}]},
          {id: 4, menuName: '流程', children: [{id: 5, menuName: 'A流程', children: [{id: 6, menuName: 'A-a'}, {id: 7, menuName: 'A-b'}]}, {id: 8, menuName: 'B流程'}]},
          {id: 9, menuName: '权限管理', children: [{id: 10, menuName: '用户列表'}, {id: 11, menuName: '权限设置'}]}
        ]
      },
      {
        name: '审核员',
        description: '对测试报告进行审核',
        permission:[
          {id: 1, menuName: '报告', children: [{id: 2, menuName: '创建报告'}, {id: 3, menuName: '编辑报告'}]},
          {id: 4, menuName: '流程', children: [{id: 5, menuName: 'A流程', children: [{id: 6, menuName: 'A-a'}, {id: 7, menuName: 'A-b'}]}, {id: 8, menuName: 'B流程'}]},
        ]
      },
      {
        name: '测试员',
        description: '出具测试报告',
        permission:[
          {id: 1, menuName: '报告', children: [{id: 2, menuName: '创建报告'}, {id: 3, menuName: '编辑报告'}]},
          {id: 4, menuName: '流程', children: [{id: 5, menuName: 'A流程', children: [{id: 7, menuName: 'A-b'}]}]},
        ]
      },
    ];
    this.menuList = [
      {
        id: 1,
        menuName: '报告',
        children: [
          {id: 2, menuName: '创建报告'},
          {id: 3, menuName: '编辑报告'},
        ]
      },
      {
        id: 4,
        menuName: '流程',
        children: [
          {
            id: 5,
            menuName: 'A流程',
            children: [
              {id: 6, menuName: 'A-a'},
              {id: 7, menuName: 'A-b'},
            ]
          },
          {id: 8, menuName: 'B流程'},
        ]
      },
      {
        id: 9,
        menuName: '权限管理',
        children: [
          {id: 10, menuName: '用户列表'},
          {id: 11, menuName: '权限设置'},
        ]
      }
    ]
  },
  methods:{
    //添加新角色
    addRole(){
      this.addRoleDialogVisible = true;
    },
    //关闭添加角色对话框，清空selectedCheckedKeys和defaultCheckedKeys
    addRoleReset(){
      this.$refs.newRoleRef.resetFields();
      this.selectedCheckedKeys = [];
      this.defaultCheckedKeys = [];
      this.$nextTick(function (){
        this.$refs.treeRef.setCheckedKeys([]);
      })
    },
    //确认添加新角色
    addNewRoleConfirm(){
      this.$refs.newRoleRef.validate(valid => {
        console.log('valid: ' + valid);
        if(valid){
          //TODO 向服务器发送请求

          this.addRoleDialogVisible = false;
        }else {

        }
      })
    },
    //打开权限设置对话框
    permissionAllot(){
      this.permissionSettingDialogVisible = true;
    },
    //获取每个角色的已有的（存储在数据库中的）权限
    getLeafKeys(permissions, array){
      permissions.forEach(item => {
        if(!item.children){
          array.push(item.id);
        }else {
          item.children.forEach(subItem => {
            if(!subItem.children){
              array.push(subItem.id);
            }else {
              this.getLeafKeys(subItem.children, array);
            }
          })
        }
      })
    },
    //获取权限设置对话框中选中的权限
    permissionSettingConfirm(){
      this.selectedCheckedKeys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(this.selectedCheckedKeys);

      //当权限设置对话框由添加用户触发（this.addRoleDialogVisible=true）时，为this.newRole.value赋值
      if(this.addRoleDialogVisible){
        const labels = [];
        this.$refs.treeRef.getCheckedNodes(false, true).forEach(item => {
          labels.push(item.menuName);
        })
        this.newRole.value = labels.toString();
      }else {
        //TODO 向服务器发送更新权限请求
      }
      this.permissionSettingDialogVisible = false;
    },
    //编辑已有角色
    editRole(roleInfo){
      this.editRoleDialogVisible = true;
      //TODO 根据角色id向服务器请求该角色所有信息，并将数据赋值给this.currentRole;
//      this.currentRole ;
    },
    //确认角色信息修改
    editRoleConfirm(){
      //TODO 将最新的数据发送到服务器，若成功则关闭对话框并提示修改成功，否则提示修改失败

    },
    //取消角色信息修改
    editRoleCancel(){
      this.$confirm('是否放弃修改角色信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editRoleDialogVisible = false;
      }).catch(() => {
      });
    },
    //重置角色信息修改对话框
    resetEditRoleDialog(){
      this.$refs.editRoleRef.resetFields();
    },
    //删除已有角色
    deleteRole(roleName){
      this.$confirm('是否删除该角色信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //TODO 向服务器发送删除请求

        //TODO 删除成功后弹出成功提示框，并刷新列表；否则弹出失败提示框

/*
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
*/
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //修改已有角色的访问权限
    permissionUpdate(permission){
      this.getLeafKeys(permission, this.defaultCheckedKeys);
      this.permissionSettingDialogVisible = true;
    },
    //重置权限设置对话框
    resetPermissionSettingDialog(){
      this.defaultCheckedKeys = [];
      this.$nextTick(function () {
        this.$refs.treeRef.setCheckedKeys([]);
      })
    }
  }
}
</script>

<style scoped>
.el-tag{
  margin: 10px;
}
.fp-top{
  border-top: 1px solid #eeeeee;
}
.fp-bottom{
  border-bottom: 1px solid #eeeeee;
}
.sp-top{
  border-top: 1px solid #eeeeee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>