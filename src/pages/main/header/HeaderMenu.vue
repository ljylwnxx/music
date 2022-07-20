<template>
  <div class="header">
    <!-- 网易云logo -->
    <div class="logo-wrap">
      <i class="iconfont icon-logView"></i>
    </div>
    <!-- 搜索框 -->
    <div class="search-input">
      <el-input
        v-model="keywords"
        placeholder="搜索"
        @change="toSearch"
        prefix-icon="el-icon-search"
        @input="handleInput"
        @blur="showInfoTip = false"
        @focus="getHotSearch"
        ref="inputRef"
        clearable
      >
      </el-input>
      <transition  name="el-fade-in">
        <div class="search-info-tip" v-show="showInfoTip">
          <div v-show="keywords === ''">
            <div class="his-search" v-show="historySearchList.length !== 0">
              <div class="hot-title font-14">
                <span>搜索历史</span>
                <button class="no-btn" @click="clearHis">
                  <i class="el-icon-delete"></i>
                </button>
              </div>
              <div class="his-wrap">
                <button
                class="btn btn-white his-item font-12"
                v-for="val in  historySearchList"
                :key="val"
                @click="clickHot(val)">
                {{val}}
                </button>
              </div>
            </div>
            <div class="hot-search">
              <div class="hot-title font-14">热搜榜</div>
              <div
              class="hot-item pointer"
              :class="{ 'top-item': index < 3 }"
              v-for="(item,index) in hotList"
              :key="index"
               @click="clickHot(item.searchWord)">
              <div class="item-index">{{ index + 1 }}</div>
              <div class="item-info">
                  <div class="key-word">
                    <span class="font-12 item-key">{{ item.searchWord }}</span>
                    <span style="color: #c2c1c1" class="font-12 mleft-10">
                      {{item.score}}
                    </span>
                  </div>
                  <div>
                    <span style="color: #999999" class="font-12">
                      {{item.content}}
                    </span>
                  </div>
              </div>
              </div>
            </div>
          </div>
          <div v-show="keywords !== ''">
            <div class="search-suggest">
              <div class="search-btn-wrap">
                <button class="no-btn">
                  搜“{{ keywords }}”相关的内容<i
                    class="el-icon-arrow-right"
                  ></i>
                </button>
              </div>
              <SuggestList v-if="showMusic">
                <template #title>
                  <i class="iconfont icon-yinle font-16"></i
                  ><span class="mleft-10">单曲</span>
                </template>
                <template #item>
                  <div
                    v-for="s in suggestInfo.songs"
                    :key="s.id"
                    class="item pointer text-hidden"
                    @click="playMusic(s.id)"
                  >
                    {{ s.name }} - {{ s.artists[0].name }}
                  </div>
                </template>
              </SuggestList>
              <SuggestList v-if="showAlbum">
                <template #title>
                  <i class="iconfont icon-zhuanji font-16"></i
                  ><span class="mleft-10">专辑</span>
                </template>
                <template #item>
                  <div
                    v-for="al in suggestInfo.albums"
                    :key="al.id"
                    class="item pointer text-hidden"
                    @click="toAlbumDetail(al.id)"
                  >
                    {{ al.name }} - {{ al.artist.name }}
                  </div>
                </template>
              </SuggestList>
              <SuggestList v-if="showArtist">
                <template #title
                  ><i class="el-icon-user font-16"></i
                  ><span class="mleft-10">歌手</span>
                </template>
                <template #item>
                  <div
                    v-for="ar in suggestInfo.artists"
                    :key="ar.id"
                    class="item pointer text-hidden"
                    @click="toArtistDetail(ar.id)"
                  >
                    {{ ar.name }}
                  </div>
                </template>
              </SuggestList>

              <SuggestList v-if="showPlaylist">
                <template #title>
                  <i class="iconfont icon-gedan font-16"></i
                  ><span class="mleft-10">歌单</span>
                </template>
                <template #item>
                  <div
                    v-for="p in suggestInfo.playlists"
                    :key="p.id"
                    class="item pointer text-hidden"
                    @click="toPlayListDetail(p.id)"
                  >
                    {{ p.name }}
                  </div>
                </template>
              </SuggestList>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 登录按钮 -->
    <div class="user-login pointer" @click="loginView">
      <el-avatar :size="30" icon="el-icon-user-solid" :src="avatarUrl"> </el-avatar>
    </div>
    <div class="login-text pointer"  @click="doLogout">{{name}}</div>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import SuggestList from '@/components/list/SuggestList'
export default {
  name: 'HeaderMenu',
  components: { SuggestList },
  data () {
    return {
      keywords: '',
      hotList: [],
      historySearchList: [],
      showInfoTip: false,
      suggestInfo: {}
    }
  },
  computed: {
    showMusic () {
      return Object.hasOwnProperty.call(this.suggestInfo, 'songs')
    },
    showAlbum () {
      return Object.hasOwnProperty.call(this.suggestInfo, 'albums')
    },
    showArtist () {
      return Object.hasOwnProperty.call(this.suggestInfo, 'artists')
    },
    showPlaylist () {
      return Object.hasOwnProperty.call(this.suggestInfo, 'playlists')
    },
    name () {
      return this.$store.state.isLogin ? this.$store.state.profile.nickname : '未登录'
    },
    avatarUrl () {
      return this.$store.state.isLogin ? this.$store.state.profile.avatarUrl : ''
    }
  },
  methods: {
    toSearch () {
      if (this.keywords === '') return
      this.$refs.inputRef.blur()
      if (this.$route.path !== '/search/' + this.keywords) {
        this.$router.push('/search/' + this.keywords)
      }
      this.setHistory(this.keywords)
    },
    getHotSearch () {
      httpGet(`/api/search/hot/detail`).then(res => {
        if (res.data.code !== 200) { return }
        this.showInfoTip = true
        this.hotList = res.data.data
      })
    },
    getSuggest (val) {
      httpGet(`/api/search/suggest?keywords=${val}`).then(res => {
        if (res.data.code !== 200) { return }
        if (Object.keys(res.data.result).length !== 0) { this.suggestInfo = res.data.result }
      })
    },
    getHistory () {
      if (!window.localStorage.getItem('search')) return
      this.historySearchList =
        JSON.parse(window.localStorage.getItem('search')) instanceof Array
          ? JSON.parse(window.localStorage.getItem('search'))
          : []
    },
    setHistory (val) {
      if (val) {
        if (this.historySearchList.findIndex((item) => item === val) !== -1) { return }
        this.historySearchList.unshift(val)
        this.historySearchList = this.historySearchList.slice(0, 5)
        window.localStorage.setItem(
          'search',
          JSON.stringify(this.historySearchList)
        )
      }
    },
    clickHot (val) {
      if (val !== '') {
        this.keywords = val
        this.toSearch()
      }
    },
    clearHis () {
      this.$confirm('确认清空历史记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('search')
        this.historySearchList = []
      })
    },
    doLogout () {
      if (!this.$store.state.isLogin) this.$router.push('/login')
      this.$store.dispatch('logout')
    },
    loginView () {
      if (!this.$store.state.isLogin) this.$router.push('/login')
      else {
        if (this.$route.path === '/userdetail/' + this.$store.state.account.id) return
        this.$router.push('/userdetail/' + this.$store.state.account.id)
      }
    },
    handleInput (val) {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.timer = window.setTimeout(() => {
        console.log(val, 'timer')
        this.getSuggest(val)
      }, 500)
    }
  }
}
</script>

<style  scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
}
.logo-wrap {
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}
.icon-logView {
  font-size: 50px;
}
.history-icon {
  margin-left: 100px;
  display: flex;
}
.btn-circle {
  display: flex;
  height: 26px;
  width: 26px;
  outline: 0;
  border: 0;
  background-color: #e13e3e;
  color: #ffffff;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
}
.iconel-icon-arrow-left {
  height: 12px;
  width: 12px;
  color: #fff;
}
.user-login {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}
.login-text {
  margin-left: 10px;
  font-size: 12px;
}
.search-input {
  margin-left: 10px;
  position: relative;
}
  .search-input .search-info-tip {
  position: absolute;
  top: 40px;
  left: 0;
  width: 340px;
  min-height: 340px;
  max-height: 420px;
  transition: all 0.5s;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 1px 4px #dddddd;
  background-color: #fff;
  z-index: 100;
  color: #000;
  }
  .hot-search {
  margin-top: 20px;
  }
  .hot-item {
  height: 50px;
  display: flex;
  align-items: center;
  }
  .hot-item:hover {
    background-color: #f2f2f2;
  }
  .item-index {
    color: #c2c2c2;
    width: 40px;
    text-align: center;
  }
  .top-item .item-index {
    color: #f85757;
  }
  .top-item .item-key {
    font-weight: bold;
  }
.his-wrap {
  padding: 0 18px;
  display: flex;
  flex-wrap: wrap;
}
  .his-item {
    margin: 0 10px 10px 0;
    height: 26px;
  }
</style>
