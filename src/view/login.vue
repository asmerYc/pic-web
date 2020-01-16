<template>
  <div class="container">
    <div class="header">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="18">
          <div class="info">
            <div>
              <img  class="logo" src="../assets/images/10_03.png" alt="">
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
    <div class="main"></div>
    <div class="footer"></div>
    <el-button type="warning" @click="toLogin">登录</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome'
    }
  },
  methods: {
    toLogin () {
      this.$router.push({ path: 'home' })
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
  height:100vh;
  display:flex;
  flex-direction:column;
}
.header {
  height: 130px;
  font-family:MicrosoftYahei;
  color:#f8b62b
}
.header  .info .logo {
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
  padding-left:8px;
}
.right .top {
  font-size: 28px;
}
.right .bottom {
  font-size: 12px;
}
.main {
  height: 500px;
  background-color: yellow;

}
.footer {
  flex-grow:1;
  overflow:auto;
  background-color: red;
}
</style>
