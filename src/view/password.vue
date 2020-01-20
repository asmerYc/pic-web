<template>
  <div class="container">
    <!-- <div class="header">
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
    </div> -->
    <div class="main">
      <div class="logarea">
        <div>
          <div class="loginfo_top">
            <span class="left">登录账户</span>
            <span class="right">{{account}}</span>
          </div>

        </div>
        <el-input
          @blur="onblur"
          @input="watchInput"
          size="medium"
          placeholder="用户"
          v-model="userName"
          >
      </el-input>
      <el-input placeholder="请输入密码" v-model="passWord" @keyup.enter.native="toLogin" type="password"></el-input>
    
      <el-button  type="warning" @click="toLogin">确定</el-button>
      </div>
    </div>
    <div class="footer">
      <div class="top">©️2018 lu99.xadmin.029tulingling.com 版权所有</div>

    </div>
  </div>
</template>

<script>
import {apiAddress, queryUser} from '../request/api'
import { mapMutations, mapState } from 'vuex';
export default {
  computed:{
    ...mapState(['account']),
  },
  data () {
    return {
      msg: 'Welcome',
      userName: '',
      passWord: '',
      isNewUser:false,
      isDisabled:true,
    }
  },
  created() {
    // this.keyupSubmit()
  },
  methods: {
    ...mapMutations(['changeLogin']),
    toLogin () {
      if(this.userName === "" || this.passWord === "") {
        this.$message({
            message:"账号或者密码不能为空!",
            type: 'warning'
        })
        return;
      }
      const body = {
        account:this.userName,
        password:this.passWord
      }
      apiAddress(body).then(res => {
        if(res) {
          this.$message({
            message:"登录成功!",
            type: 'success'
        })
          const user = {
            Authorization: res.token,
            is_manager: res.is_manager,

          }
          this.changeLogin(user);
          this.$router.push({ path: 'home' })
        }
      }).catch(error => {
        this.$message({
          message:"请确认密码是否正确!",
          type: 'warning'
        })
      })
  
    },
    //用户栏失去焦点事件,查询一下用户是新用户还是老用户

    onblur () {
      // 在这去调用查询用户是否存在的接口
      if (this.userName) {
        queryUser(this.userName).then (res => {
          this.isNewUser = res && res.password_status === 0 ? true : false
          if(res && res.code === 0) {
            this.isDisabled = true;
            this.$message({
              message:`${res.msg},请确认账号是否正确!`,
              type: 'error'
           })
           return;
          }
          this.isDisabled = false;
        }).catch(error => {
          console.log(error)
      })
      }
      
    },
    //监听用户输入框的值
    watchInput (value) {
      if(!value) this.isDisabled = true;
    }

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
.main {
  display: flex;
  width: 100%;
  flex:1;
  background-color: #f1f1f1;
  justify-content:center;
  align-items: center;
  
}
.main .logarea {
  text-align: center;
  border:1px solid #acacac;
  height: 460px;
  width: 778px;
}


.logarea >>> input.el-input__inner {
  width: 294px;
  height: 46px;
  margin-bottom: 24px;
}
.loginfo_top {
  margin-top: 72px;
  margin-bottom:15px;
  font-size: 14px;
  color:#555;
  text-align: left;
}
.loginfo_top .left {

  margin-left:10px;
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
  color: #0076CE;
}
.logarea >>> .el-button {
  width: 294px;
  height: 46px;
}
</style>
