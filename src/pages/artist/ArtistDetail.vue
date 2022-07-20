<template>
  <div class="artist-detail mtop-20">
    <div class="artist-info">
      <div class="img-wrap">
        <img
          v-lazy="artistInfo.cover || imgUrl"
          class="img-h image-radius-8 image-border"
        />
      </div>
      <div class="info">
        <div class="font-24 font-bold">{{ artistInfo.name }}</div>
        <div class="info-btn">
          <button class="btn btn-white mleft-10" @click="subArtists">
            <span v-if="!isSub" ><i class="el-icon-folder-add"></i> 收藏</span>
            <span v-else><i class="el-icon-folder-checked"></i> 已收藏</span>
          </button>
          <button class="btn btn-white mleft-10" v-if="showPriMsg" @click="toUserDetail">
            <i class="el-icon-user"></i>
            个人主页
          </button>
        </div>
        <div>
          <span class="font-14">单曲数:{{ artistInfo.albumSize }}</span>
          <span class="mleft-20 font-14"
            >专辑数:{{ artistInfo.albumSize }}</span
          >
          <span class="mleft-20 font-14">MV数:{{ artistInfo.mvSize }}</span>
        </div>
      </div>
    </div>
    <art-tabs-menu :key="id"></art-tabs-menu>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import ArtTabsMenu from '../../components/menu/ArtTabsMenu'
export default {
  name: 'ArtistDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    ArtTabsMenu
  },
  data () {
    return {
      artistInfo: {
        name: '',
        cover: '',
        briefDesc: '',
        albumSize: 0,
        musicSize: 0
      },
      imgUrl:
        'http://p4.music.126.net/LL43QzRrox3PzXblIwfSUQ==/109951165995568722.jpg',
      showPriMsg: false,
      isSub: false,
      userId: 0
    }
  },
  watch: {
    id (newVal) {
      console.log(newVal, 'newVal')
      this.getArtistDetail(newVal)
    }
  },
  created () {
    this.getArtistDetail()
    this.getSubArtists()
  },
  methods: {
    getArtistDetail () {
      httpGet(`/api/artist/detail?id=${this.id}`).then((res) => {
        console.log(res, 'fg')
        if (res.data.code !== 200) { return }
        this.artistInfo = res.data.data.artist
        this.showPriMsg = res.data.data.showPriMsg
        if (this.showPriMsg) { this.userId = res.data.data.user.userId }
        this.getSubArtists()
      })
    },
    getSubArtists () {
      httpGet(`/api/artist/sublist`).then(res => {
        if (res.data.code !== 200) { return }
        let subList = []
        subList = res.data.data
        let isSub = subList.find(item => Number(item.id) === Number(this.id))
        if (isSub) {
          this.isSub = true
        } else {
          this.isSub = false
        }
      })
    },
    subArtists () {
      httpGet(`/api/artist/sub?id=${this.id}&t=${this.isSub ? 0 : 1}`).then(res => {
        if (res.data.code !== 200) { return }
        if (!this.isSub) {
          this.$message.success('收藏成功')
        } else {
          this.$message.error('取消成功')
        }
        this.isSub = !this.isSub
        this.getSubArtists()
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
    toUserDetail () {
      if (this.userId !== 0 && this.showPriMsg) { this.$router.push('/userdetail/' + this.userId) }
    },
    toArtistDetail (id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    }
  }

}
</script>

<style scoped>
.artist-detail {
   width: 90%;
   margin: 0 auto;
   margin-top: 20px;
}
.artist-info {
  height: 200px;
  display: flex;
}
.artist-info .img-wrap {
  width: 200px;
  height: 200px;
}
.artist-info .info {
  margin-left: 30px;
  line-height: 50px;
}
.backtop {
  right: 20px!important;
    bottom: 79px!important;
  }
</style>
