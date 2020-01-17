<template>
  <div id="app">
    <div v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </div>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
</style>
