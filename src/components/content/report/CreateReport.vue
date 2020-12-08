<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报告</el-breadcrumb-item>
      <el-breadcrumb-item>创建报告</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="">
            <el-button slot="append" icon="el-icon-search" @click=""></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">创建报告</el-button>
        </el-col>
      </el-row>

      <el-table :data="reportlist" border stripe height="250">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="名称" prop="reportname"></el-table-column>
        <el-table-column label="类型" prop="reporttype"></el-table-column>
        <el-table-column label="日期" prop="reportdate"></el-table-column>
        <!--有插槽的情况下，prop会被覆盖，不再生效，可直接删除 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--  scope.row可以拿到本行数据-->
            <el-switch v-model="scope.row.reportstate" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.reportname)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeByName(scope.row.reportname)"></el-button>
            <el-tooltip effect="dark" content="设置权限" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[1, 5, 10, 20, 60]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <el-dialog
          title="提示"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClosed">
        <span>
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
            <el-form-item label="报告名称" prop="reportName">
              <el-input v-model="addForm.reportName"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addReport">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
          title="修改报告"
          :visible.sync="editDialogVisible"
          width="50%"
          @close="editDialogClose">
        <span>
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
            <el-form-item label="报告名称" prop="reportName" >
              <el-input v-model="editForm.reportName" disabled></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="reportType">
              <el-input v-model="editForm.reportType"></el-input>
            </el-form-item>

          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editReportInfo">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "CreateReport",
  data(){
    /*自定义验证规则*/
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if(regEmail.test(value)){
        callback();
      }else {
        callback(new Error('请输入合法的邮箱'));
      }
    }
    return{
      reportlist:[],
      //后台接口设计：必须传入每页显示几条和当前页码
      queryInfo:{
        query: '',
        pageNum: 1,
        pageSize: 1
      },
      total: 0,
      addDialogVisible : false,
      addForm:{
        reportName: ''
      },
      addFormRules:{
        reportName: [
          {required: true, message: "请输入报告名称", trigger: "blur"},
          {min: 3, max: 20, message: "报告的名称在3-20个字符之间", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"}
        ]
      },
      editDialogVisible: false,
      editForm:{
        reportName: '',
        reportType: ''
      },
      editFormRules:{
        reportType:[
          {required: true, message: "请输入类型", trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.reportlist = [
      {reportname: "二三类项目", reporttype: "A", reportdate: "20201204", reportstate: true},
      {reportname: "密评项目", reporttype: "B", reportdate: "20201204", reportstate: false}
    ];
    this.total = this.reportlist.length;
  },
  methods:{
    getReportList(){
      console.log(this.reportlist);
      return this.reportlist;
    },
    /*监听pageSize（每页显示几条）改变的事件*/
    handleSizeChange(newSize){
      console.log(newSize);
      this.queryInfo.pageSize = newSize;
      //TODO 重新请求数据
    },
    /*监听页码值（当前页码值）改变的事件*/
    handleCurrentChange(newPage){
      console.log("第" + newPage + "页");
      this.queryInfo.pageNum = newPage;
      //TODO 重新请求数据
    },
    userStateChanged(userInfo){
      //TODO 同步前端最新的状态到服务器数据库
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    addReport(){
      this.$refs.addFormRef.validate(valid => {
        if(valid){
          //TODO 发起网络请求：根据后台接口进行请求

          this.addDialogVisible = false;
        }
      })
    },
    showEditDialog(reportname){
      console.log(reportname);
      this.editForm.reportName = reportname;
      //TODO 实际实现：通过reportname请求该记录所有字段，并赋值给editForm
      this.editDialogVisible = true;
    },
    editDialogClose(){
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
    },
    editReportInfo(){
      this.$refs.editFormRef.validate(valid => {
        console.log(valid);
        if(valid){

        }
        this.editDialogVisible = false;
      })
    },
    removeByName(name){
      this.$confirm('此操作将永久删除该报告，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.error('已取消删除')
      })
    }
  }
}
</script>

<style>

</style>