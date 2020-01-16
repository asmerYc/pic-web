<template>
  <div class="container">
    <h1>{{ msg }}</h1>
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
.container {
  
}
</style>
