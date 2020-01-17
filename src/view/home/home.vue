<template>
  <div>
    <header-vue></header-vue>
    <div class="home">
      <el-container>
        <el-aside class="aside" width="245px">Aside</el-aside>
        <el-container>
          <el-header class="header">Header</el-header>
          <el-main class="main">Main</el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import headerVue from '../header'
export default {
  data () {
    return {
    }
  },
  components: { headerVue }
}
</script>

<style scoped>
.aside {
  height: 100%;
}
.main {
}
</style>
