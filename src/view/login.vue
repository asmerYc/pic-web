/* eslint-disable handle-callback-err */
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
        <div>
          <div class="loginfo_top">登陆账号</div>
          <div class="loginfo_bottom">ACCOUNT NUMBER</div>
        </div>
        <!-- <el-input @blur="onblur" size="medium" placeholder="用户" v-model="userName"></el-input> -->
        <el-input
          @blur="onblur"
          @input="watchInput"
          size="medium"
          placeholder="用户"
          v-model="userName"
        ></el-input>
        <el-input
          @blur="pwdBlur"
          placeholder="请输入密码"
          v-model="passWord"
          @keyup.enter.native="toLogin"
          type="password"
        ></el-input>
        <el-link
          v-if="isNewUser"
          class="operatepsd"
          @click="operatePsd($event.target.innerText)"
          :underline="false"
          v-bind:class="[isNewUser ? 'psdHighLight' : 'psdHighLight']"
          :disabled="isDisabled"
        >设置密码</el-link>
        <el-link
          v-if="!isNewUser"
          class="operatepsd"
          @click="operatePsd($event.target.innerText)"
          :underline="false"
          v-bind:class="[pwdPass ? 'psdHighLight' : 'psdHighLight']"
          :disabled="pwdPass"
        >重置密码</el-link>
        <el-button type="warning" @click="toLogin">登录</el-button>
      </div>
    </div>
    <div class="footer">
      <div class="top">鹿久久 | 关于我们 | 咨询服务 | 广告招商</div>
      <div class="middle">
        客服热线 ： 88888888 周一至周日 09:00-18:00 2018 ©️
        图领领网络科技有限公司 陕ICP备 88888888
      </div>
      <div class="bot">图领领网络科技提供技术支持</div>
    </div>
  </div>
</template>

<script>
import { apiAddress, queryUser } from "../request/api";
import { mapMutations } from "vuex";
export default {
  data () {
    return {
      msg: "Welcome",
      userName: "",
      passWord: "",
      isNewUser: false,
      isDisabled: true,
      pwdPass: true,
      loading: false,
    };
  },
  created () {
    // this.keyupSubmit()
  },
  methods: {
    ...mapMutations(["changeLogin", "saveUser", "savePwd"]),
    toLogin () {
      if (this.userName === "" || this.passWord === "") {
        this.$message({
          message: "账号或者密码不能为空!",
          type: "warning"
        });
        return;
      }
      const body = {
        account: this.userName,
        password: this.passWord
      };
      this.loading = true;
      apiAddress(body)
        .then(res => {
          this.loading = false;
          if (res) {
            this.$message({
              message: "登录成功!",
              type: "success"
            });
            const user = {
              token: res.token,
              is_manager: res.is_manager
            };
            this.changeLogin(user);
            this.$router.push({ path: "home" });
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.loading = false;
          this.$message({
            message: "请确认密码是否正确!",
            type: "warning"
          });
        });
    },
    // 用户栏失去焦点事件,查询一下用户是新用户还是老用户

    onblur () {
      // 在这去调用查询用户是否存在的接口
      if (this.userName) {
        queryUser(this.userName)
          .then(res => {
            this.isNewUser = !!(res && res.password_status === 0);
            if (res && res.code === 0) {
              this.isDisabled = true;
              this.$message({
                message: `${res.msg},请确认账号是否正确!`,
                type: "error"
              });
              return;
            }
            const user = {
              ...res
            };
            this.saveUser(user);
            this.isDisabled = false;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    pwdBlur () {
      // if (!this.passWord) {
      //   return;
      // }
      const body = {
        account: this.userName,
        password: this.passWord
      };
      this.savePwd(this.passWord);
      apiAddress(body)
        .then(res => {
          if (res) {
            this.pwdPass = false;
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.pwdPass = true;
        });
    },
    // 监听用户输入框的值
    watchInput (value) {
      if (!value) this.isDisabled = true;
    },

    // 重置或者设置密码按钮事件
    operatePsd (value) {
      this.$router.push({
        path: "password",
        query: {
          name: value
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  height: 100vh;
  font-family: MicrosoftYahei;
  background-color: #f1f1f1;
}
.header {
  height: 130px;
  font-family: MicrosoftYahei;
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
.main {
  position: relative;
  height: 48%;
  min-height: 430px;
  max-height: 528px;
  background-image: url("../assets/images/08_02.png");
  background-repeat: no-repeat;
}
.main .logarea {
  text-align: center;
  position: absolute;
  background-color: #fff;
  height: 108%;
  width: 330px;
  right: 20%;
  top: -28px;
  box-shadow: darkgrey 2px 5px 10px 5px;
}

.main .logarea::before {
  position: absolute;
  left: -28px;
  content: " ";
  display: block;
  height: 28px;
  width: 28px;
  background: url("../assets/images/登录页面_03.png") no-repeat;
  background-size: 100%;
}

.logarea >>> input.el-input__inner {
  width: 294px;
  height: 46px;
  margin-bottom: 24px;
}
.loginfo_top {
  margin-top: 72px;
  font-size: 32px;
  color: #353535;
}
.loginfo_bottom {
  margin-bottom: 42px;
  margin-top: 10px;
  font-size: 20px;
  color: #323232;
}
.operatepsd {
  position: relative;
  right: -115px;
  top: -12px;
}
.psdCommon {
  color: #b8b8b8;
}
.psdHighLight {
  color: #0076ce;
}
.logarea >>> .el-button {
  width: 294px;
  height: 46px;
}
.footer {
  flex-grow: 1;
  overflow: auto;
  margin-top: 22px;
  text-align: center;
  color: #646464;
  font-size: 12px;
}
.footer .top {
  margin-bottom: 10px;
}
.footer .middle {
  margin-bottom: 10px;
}
.footer .bot {
  margin-bottom: 10px;
}
</style>
