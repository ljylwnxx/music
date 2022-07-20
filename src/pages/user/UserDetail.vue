<template>
  <div class="user-detail mtop-20">
    <div class="user-info">
      <div class="user-img-wrapper">
        <img class="img image-radius-8 image-border" :src="info.avatarUrl" />
      </div>
      <div class="info-wrap mleft-20" >
       <div class="font-24 font-bold">{{ info.nickname }}</div>
        <div class="info-btn">
            <div>
                <el-tag size="medium" effect="plain" class="font-12 level-wrap">Lv.{{ level }}</el-tag>
                <span class="font-14 sex-wrap">
                    <i
                        v-if="info.gender == 1"
                        style="color: #3da1d1"
                        class="el-icon-male"
                    >
                    </i>
                    <i
                        v-else-if="info.gender == 2"
                        style="color: #ea5a95"
                        class="el-icon-female"
                    >
                    </i>
                 </span>
            </div>
            <div v-if="this.$store.state.isLogin && this.$store.state.profile.userId === userId">
                <el-button
                size="small"
                round
                plain
                class="btn btn-white"
                @click="UserEdit"
                >
               <i class="el-icon-edit"></i>编辑个人信息
                </el-button>
            </div>
            <div v-else>
            <el-button
            size="small"
            round
            plain
            >
            <i class="el-icon-message"></i>发私信
            </el-button>
            <el-button
            size="small"
            round
            plain
            class="btn btn-white mleft-10"
            @click="follow"
            >
                  <template v-if="!followed">
                  <i class="el-icon-plus"></i> 关注
                  </template>
                  <template v-else>
                  <i class="el-icon-check"></i> 已关注
                  </template>

            </el-button>
          </div>
        </div>
        <div class="div-line"></div>
        <div class="info-num mtop-10">
          <div class="num-item">
            <el-tag type="danger" class="item-text font-12">动态</el-tag>
            <el-tag type="danger" effect="plain" class="font-20 font-bold" >{{ info.eventCount }}</el-tag>
          </div>
          <div class="num-item">
            <el-tag type="warning" class="item-text font-12">关注</el-tag>
            <el-tag type="warning" effect="plain" class="font-20 font-bold" >{{ info.follows }}</el-tag>
          </div>
          <div class="num-item">
            <el-tag type="success" class="item-text font-12">粉丝</el-tag>
            <el-tag type="success" effect="plain" class="font-20 font-bold" >{{ info.followeds }}</el-tag>
          </div>
        </div>
        <div class="desc-item mtop-10 font-14" v-if="info.city">所在地区:{{info.city}}</div>
                <el-collapse accordion>
                  <el-collapse-item class="brief">
                    <template slot="title">
                      个人介绍：
                      <i class="header-icon el-icon-info"></i>
                    </template>
                    <div style="max-width: 1000px">
                      {{ info.signature || "暂无简介" }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
      </div>
    </div>
      <div class="menu-wrap mtop-20">
      <AlbumTabsMenu
        :menuList="['创建的歌单', '收藏的歌单']"
        @menuClick="handMenuClick"
      >
      </AlbumTabsMenu>
    </div>
    <div class="mtop-20" v-show="showtab === 1">
      <ImgList @clickImg="toPlayListDetail" :list="creList" type="playlist">
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
    <div class="mtop-20" v-show="showtab === 2">
    <div v-if="subList.length !== 0">
       <ImgList @clickImg="toPlayListDetail" :list="subList" type="playlist">
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
      <div v-else>该用户没有收藏的歌单或用户设置了隐私模式</div>
    </div>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import AlbumTabsMenu from '../../components/menu/AlbumTabsMenu'
import ImgList from '../../components/list/ImgList'
export default {
  name: 'PlayListDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    ImgList,
    AlbumTabsMenu
  },
  watch: {
    id () {
      this.list = []
      this.getUserDetail()
      this.getUserPlayList()
    }
  },
  computed: {
    sex () {
      return this.info.gender === 1 ? '男' : '女'
    },
    userId () {
      return this.info.userId
    },
    creList () {
      return this.list.filter((item) => item.userId === this.userId)
    },
    subList () {
      return this.list.filter((item) => item.userId !== this.userId)
    }
  },
  data () {
    return {
      info: {},
      list: [],
      level: 0,
      followed: false,
      offset: 0,
      showtab: 1
    }
  },
  created () {
    this.getUserDetail()
    this.getUserPlayList()
  },

  methods: {
    getUserDetail () {
      httpGet(`/api/user/detail?uid=${this.id}`).then((res) => {
        if (res.data.code !== 200) { return }
        this.info = res.data.profile
        this.level = res.data.level
        this.followed = res.data.profile.followed
        this.getCityInfo()
      })
    },
    getUserPlayList () {
      httpGet(`/api/user/playlist?uid=${this.id}&offset=${this.offset}&limit=30&timestamp=${Date.now()}`).then((res) => {
        if (res.data.code !== 200) { return }
        if (this.list.length === 0) {
          this.list = res.data.playlist
        } else {
          this.list.push(...res.data.playlist)
        }
        if (res.data.more) {
          this.offset += 30
          this.getUserPlayList()
        }
      })
    },
    follow () {
      if (!this.$store.state.isLogin) { return this.$message.warning('需要登录') }
      httpGet(`/api/follow?id=${this.info.userId}&t=${this.followed ? 0 : 1}&timestamp=${Date.now()}`).then(res => {
        if (res.data.code !== 200) { return this.$message.error('操作失败') }
        this.$message.success(this.followed ? '取关成功' : '关注成功')
        this.followed = !this.followed
      })
      this.$confirm('确认收藏？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '放弃'
      }).then(() => {
        this.$message({
          type: 'info',
          message: '绑定手机号或短信验证成功后，可进行下一步操作哦~'
        })
      })
    },
    getCityInfo () {
      httpGet('/static/city.json')
        .then(res => {
          let data = res.data
          let a = data.find(item => item.value === (this.info.city).toString()) || {}
          let b = (a.children || []).find(item => item.value === JSON.stringify(this.info.city))
          this.info.city = a && b ? a.label + b.label : '未知'
        })
    },
    handMenuClick (index) {
      this.showtab = index + 1
    },
    toPlayListDetail (id) {
      this.$router.push({ path: '/playlistdetail/' + id })
    },
    UserEdit () {
      this.$router.push('/useredit')
    }
  }
}
</script>

<style scoped>
.user-detail {
  margin-left: 50px;
}
.user-info {
  display: flex;
}
.user-img-wrapper img{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.info-wrap {
    width: 70%;
}
.info-btn {
    display: flex;
    align-items: center;
    justify-content: space-between
}
.info-num {
    display: flex;
}
.num-item {
    display: flex;
   margin-left: 10px;
}
.num-item .item-text {
    margin-right: 10px;
}
.div-line {
    margin-top: 10px;
}
</style>
