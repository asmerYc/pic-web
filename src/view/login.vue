<template>
  <div class="container">
    <div class="header">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="18">
          <div class="info">
            <div>
              <img class="logo" src="../assets/images/10_03.png" alt />
            </div>
            <div>
              <div class="title">
                <div class="left">鹿久久</div>
                <div class="right">
                  <div class="top">照片管理系统</div>
                  <div class="bottom">Photo management system</div>
                </div>
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
        <el-input @blur="onblur" size="medium" placeholder="用户" v-model="input"></el-input>
        <el-input placeholder="请输入密码" v-model="input"></el-input>
        <div class="operatepsd">重置密码</div>
        <el-button type="warning" @click="toLogin">登录</el-button>
      </div>
    </div>
    <div class="footer">
      <div class="top">鹿久久 | 关于我们 | 咨询服务 | 广告招商</div>
      <div class="middle">客服热线 ： 88888888 周一至周日 09:00-18:00 2018 ©️ 图领领网络科技有限公司 陕ICP备 88888888</div>
      <div class="bot">图领领网络科技提供技术支持</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome',
      input: ''
    }
  },
  methods: {
    toLogin () {
      this.$router.push({ path: 'home' })
    },
    onblur () {
      // 在这去调用查询用户是否存在的接口
      alert('122')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* *{
      margin:0;
      padding:0;
      box-sizing:border-box;
  } */

/* ul {
      list-style:none;
    } */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  font-size: 12px;
}
.main {
  position: relative;
  height: 500px;
  background: url("../assets/images/08_02.png");
}
.main .logarea {
  text-align: center;
  position: absolute;
  background-color: #fff;
  height: 528px;
  width: 330px;
  right: 180px;
  bottom: 0;
}

.main .logarea::before {
  position: absolute;
  left: -28px;
  content: " ";
  display: block;
  height: 28px;
  width: 28px;
  background: url("../assets/images/09_03.png") no-repeat;
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
  margin: 6px 0 30px;
  text-align: end;
  padding-right: 18px;
  color: #b8b8b8;
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
}
.footer .middle {
}
.footer .bot {
}
</style>
