<template>
  <div class="personal-recom">
    <div class="swiper">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in imgList" :key="item.imageUrl">
          <img
            class="img img-h swiper-img"
            :src="item.imageUrl"
            @click="openUrl(item.url)"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="recom-song-list" v-if="!this.$store.state.isLogin">
      <h2 class="font-20 font-bold pointer" @click="goToView">
        热门推荐
        <i class="iconfont icon-arrow-right"></i>
      </h2>
      <ImgList @clickImg="toPlayListDetail" :list="recSongList" type="playlist">
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
    <div class="recom-song-list" v-else>
      <h2 class="font-20 font-bold pointer" @click="goToView">
        推荐歌单
        <i class="iconfont icon-arrow-right"></i>
      </h2>
      <ImgList @clickImg="toPlayListDetail" :list="recoList" type="playlist">
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
    <!-- 返回 -->
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import TabsMenu from '../TabsMenu'
import ImgList from '@/components/list/ImgList.vue'
export default {
  name: 'PersonlRecommend',
  components: {
    TabsMenu,
    ImgList
  },
  props: {
    clickGo: {
      type: Function
    }
  },
  data () {
    return {
      imgList: [],
      recoList: [],
      recSongList: []
    }
  },
  watch: {
    isLogin: {
      immediate: true,
      handler () {
        if (this.$store.state.isLogin) {
          this.getRecommend()
        } else {
          this.getRecSongList()
        }
      }
    }
  },
  created () {
    this.getRecBanner()
    this.getRecSongList()
    this.getRecommend()
  },
  methods: {
    openUrl (url) {
      console.log(url)
      if (url !== null) window.open(url)
    },
    goToView () {
      this.clickGo('second')
    },
    toPlayListDetail (id) {
      if (typeof id === 'number') {
        this.$router.push({ path: '/playlistdetail/' + id })
      }
    },
    getRecBanner () {
      //   http://47.102.159.133/api/banner
      httpGet(`/api/banner`).then((res) => {
        if (res.data.code !== 200) { return }
        this.imgList = res.data.banners
        this.imgList.splice(5, this.imgList.length)
      })
    },
    getRecSongList () {
      httpGet(`/api/personalized?limit=10`).then((res) => {
        if (res.data.code !== 200) { return }
        this.recSongList = res.data.result
      })
    },
    getRecommend () {
      httpGet(`/api/recommend/resource`).then((res) => {
        if (res.data.code !== 200) { return }
        this.recoList = res.data.recommend
        this.recoList.map((item) => {
          return {
            item
          }
        })
      })
    }
  }
}
</script>

<style>
  .img-item-li {
  margin-bottom: 30px;
  width: 18%;
  margin-right: 2%;
  }
  .picimages {
  display: flex;
  flex-wrap: wrap;
  }
  .personal-recom {
  height: 600px;
  }
  .backtop {
  right: 20px !important;
  bottom: 79px !important;
  }
</style>
