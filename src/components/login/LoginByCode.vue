<template>
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="ruleForm.phone"
          placeholder="请输入手机号"
          prefix-icon="el-icon-mobile"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verification">
        <el-col :span="16">
          <el-input
            type="password"
            v-model="ruleForm.verification"
            prefix-icon="el-icon-key"
            placeholder="请输入验证码"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :offset="1" :span="6">
          <el-button :disabled="!show" @click="getCode">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{ count }}s</span>
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
export default {
  name: 'LoginByCode',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (
          this.ruleForm.phone == '' ||
          this.ruleForm.phone.length <= 10 ||
          !reg.test(this.ruleForm.phone)
        ) {
          callback(new Error('手机号错误'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      ruleForm: {
        verification: '',
        phone: ''
      },
      rules: {
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        phone: [{ validator: checkPhone, trigger: 'blur' }]
      },
      count: '',
      show: 'false'
    }
  },
  methods: {
    getCode () {
      httpGet(`/api/captcha/sent?phone=${this.ruleForm.phone}`)
        .then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error('发送失败，请检查手机号')
          } else {
            this.$message.success('发送成功！请查看手机信息')
          }
        })
      if (!this.timer) {
        this.count = 60
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        httpGet(
          `/api/login/cellphone?phone=${this.ruleForm.phone}&captcha=${this.ruleForm.verification}`
        )
          .then((res) => {})
        if (valid) {
          this.$message.success('登录成功')
          this.$router.push('/home')
        } else {
          this.$message.error('请输入正确的信息')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
</style>
