<template>
  <div class="container" v-loading="loading">
    <div class="header">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="18">
          <div class="info">
            <img class="logo" src="../assets/images/LOGO_03.gif" alt />
            <div class="title">
              <div class="left">鹿久久</div>
              <div class="right">
                <div class="top">照片管理系统</div>
                <div class="bottom">Photo management system</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <div class="logarea">
        <div class="pwd-title">您正在修改登录密码</div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          style="margin-top:45px"
        >
          <el-form-item label="登录账户">
            <span class="user-name">{{account}}</span>
          </el-form-item>
          <el-form-item label="请输入新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="请输入新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="请重复新密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="sure-btn" type="warning" @click="submitForm('ruleForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">©️2018 lu99.xadmin.029tulingling.com 版权所有</div>
  </div>
</template>

<script>
import { resetPsd } from '../request/api'
import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['account', "password"]),
    ...mapGetters(['getAccount'])
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      msg: 'Welcome',
      userName: '',
      passWord: '',
      isNewUser: false,
      isDisabled: true,
      loading: false,
      ruleForm: {
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    // this.keyupSubmit()
  },
  methods: {
    submitForm (formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        console.log(this.password)
        const body = {
          account: this.getAccount,
          password: this.password,
          new_pwd: this.ruleForm.checkPass,
        }
        if (valid) {
          resetPsd(body).then(res => {
            if (res && res.code === 1) {
              this.loading = false;
              this.$message({
                message: "修改成功!",
                type: "success"
              })
              this.$router.push({ path: "login" });
            } else {
              this.loading = false;
              this.$message({
                message: "修改失败!",
                type: "error"
              })
            }
          })
            .catch(error => {
              conso.log(error)
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  font-family: MicrosoftYahei;
  background-color: #f1f1f1;
}
.header {
  height: 130px;
  font-family: MicrosoftYahei;
  margin-bottom: 13vh;
  background-color: #fff;
  color: #f8b62b;
}
.header .info .logo {
  height: 88px;
  width: 64px;
  margin-right: 24px;
}
.header .info {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 130px;
}
.header .info .title {
  display: flex;
}
.title .left {
  padding-right: 8px;
  font-size: 40px;
  border-right: 2px solid #f8b62b;
}
.title .right {
  padding-left: 8px;
}
.right .top {
  font-size: 28px;
}
.right .bottom {
  font-size: 13px;
}
.main .logarea {
  width: 778px;
  height: 42.6%;
  min-height: 370px;
  max-height: 460px;
  margin: 0 auto;
  text-align: center;
  background-color: white;
  border: 2px solid#e5e5e5;
  border-radius: 4px;
}
.logarea .pwd-title {
  line-height: 48px;
  border-bottom: 1px solid #e5e5e5;
  width: 758px;
  text-align: left;
  font-weight: bold;
  margin: 0 auto;
}

.logarea >>> input.el-input__inner {
  width: 220px;
  height: 30px;
}
.logarea .el-button {
  width: 120px;
  height: 30px;
  padding: 0px;
}
.logarea .user-name {
  display: inline-block;
  width: 220px;
  height: 30px;
  font-size: 14px;
  color: #555555;
}
.logarea /deep/ .el-form {
  text-align: left;
  width: 320px;
  margin: 54px auto 0;
}
.logarea /deep/ .el-form-item__content {
  height: 61px;
}
.logarea /deep/ .el-form-item__label {
  padding: 0 16px 0 0;
}
.logarea /deep/ .el-input__suffix {
  top: -8px;
  right: -34px;
  font-size: 20px;
}
.logarea /deep/ .el-icon-circle-check {
  color: #f8b62b;
}
.logarea /deep/ .el-icon-circle-check:before {
  content: "\e79c";
}
.logarea /deep/ .el-icon-circle-close:before {
  content: "\e79d";
}
.logarea /deep/ .el-form-item__error {
  width: 100%;
  top: 10px;
  left: 260px;
  font-weight: 700;
}
.logarea /deep/ .el-form-item {
  margin-bottom: 0;
}
.sure-btn {
  margin-top: 28px;
}
.footer {
  text-align: center;
  font-size: 12px;
  color: #858585;
  margin-top: 6vh;
}
</style>
