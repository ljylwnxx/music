<template>
  <div class="user-edit mtop-20">
    <span class="font-20 font-bold">编辑个人信息</span>
    <div class="form-info mtop-20">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="昵称:">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="介绍:">
          <el-input type="textarea" v-model="form.signature"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio-group v-model="form.gender">
            <el-radio-button :label="0">保密</el-radio-button>
            <el-radio-button :label="1">男</el-radio-button>
            <el-radio-button :label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日:">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.birthday"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
      <div
        class="avatar-uploader"
      >
         <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" >
         <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
export default {
  name: 'UserEdit',
  data () {
    return {
      form: {
        nickname: '',
        gender: 0,
        birthday: '',
        signature: ''
      }
    }
  },
  computed: {
    dialogImageUrl () {
      return this.$store.state.profile.avatarUrl ? this.$store.state.profile.avatarUrl : ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      if (this.$store.state.isLogin) {
        this.form.gender = this.$store.state.profile.gender
        this.form.signature = this.$store.state.profile.signature
        this.form.nickname = this.$store.state.profile.nickname
        this.form.birthday = new Date(this.$store.state.profile.birthday)
      } else {
        setTimeout(() => {
          this.getInfo()
        }, 2000)
      }
    },
    onSubmit () {
      httpGet(
        `/api/user/update?gender=${this.form.gender}&signature=${
          this.form.signature
        }&nickname=${
          this.form.nickname
        }&birthday=${this.form.birthday.getTime()}`
      )
        .then((res) => {
          this.$message.success('更新成功')
          this.$store.dispatch('getAcount')
        })
    }
  }
}
</script>

<style scoped>
.user-edit {
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
}
.form-info {
  display: flex;
}
.avatar-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
  }
.avatar-uploader-icon {
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.el-icon-plus{
  font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
