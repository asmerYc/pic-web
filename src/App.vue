<template>
  <div id="app">
    <div v-if="$route.meta.keepAlive">
      <header-vue></header-vue>
      <router-view></router-view>
    </div>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import headerVue from './view/header'
export default {
  name: 'App',
  components: { headerVue }
}
</script>

<style>
</style>
