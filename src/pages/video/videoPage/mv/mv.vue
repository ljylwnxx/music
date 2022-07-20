<template>
  <div class="music-video">
    <div class="mv-item">
      <div class="new-head">
        <div>
          <button
            class="no-btn font-16 font-bold mtop-10"
            @click="toAllMv('new')"
          >
            最新MV
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <div class="cat-list">
          <div v-for="(nc, index) in newCat" :key="index" class="cat-item">
            <button
              class="no-btn"
              @click="selectNewCat(index, nc.name)"
              :class="{ isActive: nc.isActive }"
            >
              {{ nc.name }}
            </button>
          </div>
        </div>
      </div>
        <MvList :list="mvList"></MvList>
    </div>
    <div class="mv-item mtop-20">
      <div class="hot-head">
        <button
        class="no-btn font-16 font-bold mtop-10"
         @click="toAllMv('网易出品')">
          网易出品
          <i class="el-icon-arrow-right"></i>
        </button>
      </div>
         <MvList :list="netEasyList"></MvList>
    </div>
    <div class="mv-item mtop-20">
      <div class="new-head">
        <div>
          <button class="no-btn font-16 font-bold mtop-10" @click="toTopMv">
            MV排行榜
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <div class="cat-list">
          <div v-for="(tc, index) in topCat" :key="index" class="top-item">
            <button
            class="no-btn"
            :class="{ isActive: tc.isActive }"
             @click="selectTopCat(index, tc.name)">
              {{ tc.name }}
            </button>
          </div>
        </div>
      </div>
       <MvTopList :list="topList"></MvTopList>
       <el-backtop target=".el-main" class="backtop"></el-backtop>
    </div>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import MvList from '@/components/list/MvList'
import MvTopList from '@/components/list/MvTopList'
import { DEFAULT_OFFSET } from '../../../../utils/constant'
export default {
  name: 'mv',
  components: { MvList, MvTopList },
  data () {
    return {
      newCat: [
        { name: '内地', isActive: true },
        { name: '港台', isActive: false },
        { name: '欧美', isActive: false },
        { name: '日本', isActive: false },
        { name: '韩国', isActive: false }
      ],
      topCat: [
        { name: '内地', isActive: true },
        { name: '港台', isActive: false },
        { name: '欧美', isActive: false },
        { name: '日本', isActive: false },
        { name: '韩国', isActive: false }
      ],
      newQueryInfo: {
        area: '内地'
      },
      topQueryInfo: {
        area: '内地',
        limit: 10,
        offset: DEFAULT_OFFSET
      },
      mvList: [],
      netEasyList: [],
      topList: []
    }
  },
  created () {
    this.getNewMv()
    this.getNetEasyMv()
    this.getTopMv()
  },
  methods: {
    getNewMv () {
      httpGet(`/api/mv/first?area=${this.newQueryInfo.area}&limit=8`).then((res) => {
        if (res.data.code !== 200) {
          return
        }
        this.mvList = res.data.data
      })
    },
    getNetEasyMv () {
      httpGet(`/api/mv/exclusive/rcmd?limit=8&offset=0`).then((res) => {
        if (res.data.code !== 200) {
          return
        }
        this.netEasyList = res.data.data
      })
    },
    getTopMv () {
      httpGet(`/api/top/mv?area=${this.topQueryInfo.area}&limit=${this.topQueryInfo.limit}&offset=${this.topQueryInfo.offset}`).then((res) => {
        if (res.data.code !== 200) {
          return
        }
        this.topList = res.data.data.slice(0, 10)
      })
    },
    toAllMv (type) {
      console.log(type)
      if (type === 'new') {
        this.$router.push({
          path: 'allmv',
          query: { area: this.newQueryInfo.area }
        })
      } else if (type === '网易出品') {
        this.$router.push({ path: '/allmv', query: { type } })
      } else {
        this.$message.error('出错')
      }
    },
    toTopMv () {
      this.$router.push({
        path: '/topmv',
        query: { area: this.topQueryInfo.area }
      })
    },
    selectNewCat (index, name) {
      this.newCat.forEach((item) => {
        item.isActive = false
      })
      this.newCat[index].isActive = true
      this.newQueryInfo.area = name
      this.getNewMv()
    },
    selectTopCat (index, name) {
      this.topCat.forEach((item) => {
        item.isActive = false
      })
      this.topCat[index].isActive = true
      this.topQueryInfo.area = name
      this.getTopMv()
    }
  }
}
</script>

<style scoped>
.isActive {
  background-color: #fcebeb;
  color: #ec4141;
  border-radius: 15px;
  padding: 0 10px;
}
.new-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cat-list {
  display: flex;
}
.cat-item {
  width: 60px;
}
.top-item {
  width: 60px;
}
.no-btn {
  height: 30px;
}
.picimages {
  display: flex;
  flex-wrap: wrap;
}
.img-item-li {
  width: 250px;
  height: 230px;
  padding: 10px 20px;
}
.mv-top-list .mv-top-img:nth-child(odd) {
  border-bottom: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
}
.mv-top-list .mv-top-img:nth-child(even) {
  border-bottom: 1px solid #f2f2f2;
}
.mv-container {
  display: flex;
  flex-wrap: wrap;
}
.mv-top-img {
  display: flex;
  align-items: center;
  width: 49%;
  height: 180px;
}

.title-line {
  margin: 4px 0;
}
.author-line {
  margin: 2px 0;
  color: #676767;
}
.top-index {
  width: 50px;
  color: #9f9f9f;
}
.img-wrap {
  min-width: 200px;
  transition: all 0.5s;
}
.img-wrap .video-img {
  height: 120px;
  width: 200px;
  border-radius: 4px;
  transition: all 0.5s;
}
.img-border {
  box-sizing: border-box;
  border: 1px solid #dddddd;
}
.top-info {
  width: 200px;
  transition: all 0.5s;
}
.backtop {
  right: 20px !important;
  bottom: 79px !important;
}
</style>
