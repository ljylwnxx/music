<template>
  <div class="login-by-ecode mtop-20">
    <div class="msg-wrap">
      打开<a
        style="text-decoration: none; color: blue"
        href="https://music.163.com/#/download"
        target="_blank"
        >网易云音乐手机端</a
      >扫码登录
    </div>
    <div class="img-wrap">
      <img class="img img-h" :src="imgData" />
      <div class="btn-refresh pointer" @click="getEcodeKey" v-show="EcodeType === 800">
        <i class="el-icon-refresh-left"></i>
      </div>
    </div>

    <div class="msg-wrap">状态：{{ message }}</div>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
export default {
  name: 'LoginByEcode',
  data () {
    return {
      key: '',
      imgData: '',
      EcodeType: '',
      message: ''
    }
  },
  created () {
    this.getEcodeKey()
  },
  methods: {
    getEcodeKey () {
      httpGet(`/api/login/qr/key`).then(res => {
        this.key = res.data.data.unikey
        this.createEcode()
      })
    },
    createEcode () {
      httpGet(`/api/login/qr/create?key=${this.key}&qrimg=true`).then(res => {
        this.imgData = res.data.data.qrimg
        this.checkEcode()
      })
    },
    checkEcode () {
      httpGet(`/api/login/qr/check?key=${this.key}`).then(res => {
        this.EcodeType = res.data.code
        this.message = res.data.message
        if (res.data.code === 801 || res.data.code === 802) {
          this.timer = window.setTimeout(() => {
            this.checkEcode()
          }, 5000)
        } else if (res.data.code === 803) {
          this.$message.success('登录成功')
          this.$router.push('/home')
        }
      })
    }
  },
  beforeDestroy () {
    window.clearTimeout(this.timer)
  }
}
</script>

<style scoped>
.login-by-ecode {   
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
