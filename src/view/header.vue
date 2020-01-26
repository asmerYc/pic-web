<template>
  <div class="header">
    <div class="left">
      <img class="logo-img" src="../assets/images/LOGO_03.gif" alt />
      <span class="logo-name">西北工业大学附属小学</span>
      <span class="line">|</span>
      <span class="system-name">照片管理系统</span>
    </div>
    <div class="right setting" v-if="is_manager=='true'?true:false" @click="openAdminTable">
      <img class="set-icon" src="../assets/images/设置_03.png" alt />
      <span>管理员设置</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'getManager'
    ])
  },
  created () {
    this.is_manager = this.getManager
  },
  data () {
    return {
      is_manager: false
    }
  },
  methods: {
    // ...mapMutations(["is_manager"]),
    // cgIsmanager () {
    //   //   this.isShow = is_manager(localStorage.getItem('is_manager'));
    //   this.isShow = localStorage.getItem('is_manager');
    // },

    openAdminTable () {
      this.$emit('tableVisibleAdmin', true)
    },
    toSet () {
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  padding: 0 54px 0 45px;
  color: #f0f0f0;
  background-color: #f8b62b;
}
.left,
.right {
  display: flex;
  align-items: center;
}
.logo-img {
  width: 32px;
  height: 44px;
  margin-right: 30px;
}
.logo-name {
  font-size: 18px;
}
.line {
  margin: 0 10px;
  font-size: 18px;
}
.setting {
  cursor: pointer;
}
.set-icon {
  margin-right: 10px;
}
</style>
