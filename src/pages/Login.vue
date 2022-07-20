<template>
  <div class="login">
      <div class="login-container">
      <div class="login-wrapper">
        <span class="title">{{ activeName }}登录</span>
        <div class="type-btn-wrap type-btn-wrap_active">
          <el-tabs v-model="activeName">
            <el-tab-pane
              v-for="item in Menu"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <component :is="currenComponent" ref="loginRef"></component>
      </div>
    </div>
  </div>
</template>

<script>
import LoginByPhone from '@/components/login/LoginByPhone'
import LoginByCode from '@/components/login/LoginByCode'
import LoginByEcode from '@/components/login/LoginByEcode'
export default {
  name: 'Login',
  components: { LoginByPhone, LoginByCode, LoginByEcode },
  beforeDestroy () {
    this.$store.dispatch('getAcount')
  },
  data () {
    return {
      currenComponent: 'LoginByPhone',
      activeName: '手机号',
      Menu: [
        {
          label: '手机号',
          name: '手机号',
          compoment: LoginByPhone
        },
        {
          label: '二维码',
          name: '二维码',
          compoment: LoginByEcode

        },
        {
          label: '验证码',
          name: '验证码',
          compoment: LoginByCode
        }
      ]
    }
  },
  watch: {
    activeName: function (newVal) {
      this.currenComponent = this.Menu.find(item => item.name === this.activeName).compoment
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}
.login-container {
  min-height: 100vh;
  background-image: url('../assets/images/background.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrapper {
  width: 500px;
  height: 600px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 65px 55px 54px 55px;
}
.title {
  display: block;
  font-size: 30px;
  color: #423d3d;
  line-height: 1.2;
  text-align: center;
  padding-bottom: 30px;
}
.type-btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
}
</style>
