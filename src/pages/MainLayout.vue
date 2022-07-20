<template>
  <div class="main-layout">
    <div>
      <el-header style="height: 60px">
        <header-menu></header-menu>
      </el-header>
      <div class="main">
        <el-aside width="200px">
          <main-aside></main-aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </div>
      <div>
        <el-footer style="height: 60px">
          <main-footer></main-footer>
        </el-footer>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderMenu from './main/header/HeaderMenu'
import MainAside from './main/aside/MainAside'
import MainFooter from './main/footer/MainFooter'

export default {
  name: 'MainLayout',
  components: {
    HeaderMenu,
    MainAside,
    MainFooter
  }
}
</script>

<style scoped>
.main-layout {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #ec4141;
  width: 100%;
}
.main {
  display: flex;
  height: 790px;
  overflow: hidden;
  overflow-y: scroll;
}
.el-input__inner {
  height: 36px;
  line-height: 36px;
  background-color: #e13e3e;
  border-radius: 20px;
  border: 0;
  color: #fffafa;
}
</style>
