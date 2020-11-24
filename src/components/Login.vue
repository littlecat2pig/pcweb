<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/rabbit.jpg" alt="头像">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username" >
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      loginForm: {
        username: '',
        password: '',
      },
      loginFormRules:{
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 30, message: "长度在6-30个字符", trigger: "blur"}
        ]
      },
    }
  },
  methods:{
    resetLoginForm(){
      /*重置表单*/
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      /*表单预验证*/
/*
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;

        const {data: result} = await this.$http.post('login', this.loginForm);
        console.log(result);
        if(result.meta.status !== 200){
          console.log("登录失败");
        }else {
          console.log("登陆成功");
          window.sessionStorage.setItem("token", result.data.token);
        }
      });
*/
      this.$refs.loginFormRef.validate(valid => {
        if(!valid) return;

        this.$http.post('login', this.loginForm).then(() => {
              this.$message.success('登录成功！');
            }).catch( error => {
              this.$message.error('登录失败: ' + error);
              this.$router.push("/home");
        })
      })
    }
  }
}
</script>

<style scoped>
.login_container{
  background-color: #b24262;
  height: 100%;
  width: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 70px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: center;
}
</style>