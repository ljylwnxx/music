<template>
  <div class="play-list-detail mtop-20">
    <el-skeleton :loading="isLoading" animated>
      <template slot="template">
        <el-skeleton-item variant="image" style="width: 180px; height: 180px" />
        <div style="padding-top: 14px">
          <el-skeleton-item variant="text" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template>
        <div>
          <div class="detail-desc">
            <div class="detail-img-wrapper">
              <img
                class="img image-radius-8 image-border"
                :src="ImgUrl"
              >
            </div>
            <div class="detail-desc-info">
              <div class="info-title">
                <Tag text="歌单"></Tag>
                <span class="mleft-12 font-20 font-bold">{{ info.name }}</span>
                <span
                  v-if="showEditIcon"
                  @click="toPlayListEdit"
                  class="mleft-10 font-18 pointer"
                  style="color: #a3a3a3"
                >
                  <i class="el-icon-edit"></i>
                </span>
              </div>
              <div class="author">
                <div class="author-img pointer" @click="toUserDetail(creator)">
                  <img class="img-h circle" :src="creator.avatarUrl">
                </div>
                <div class="author-info">
                  <span class="mleft-12 font-12 pointer" style="color: #0b58b0" @click="toUserDetail(creator)">
                    {{ creator.nickname }}
                  </span>
                  <span class="mleft-12 font-12">
                    {{ info.createTime | dateFormat }}
                  </span>
                </div>
              </div>
              <div class="info-btn">
                <button class="btn btn-red" @click="playClickAll">
                  <i class="iconfont icon-bofang"></i>
                  <span class="btn-text">播放全部</span>
                </button>
                <button
                  v-if="!subscribed"
                  class="btn btn-white mleft-10"
                  :disabled="subDisabled"
                  @click="subPlaylist(1)"
                 >
                  <i class="el-icon-folder-add"></i>
                  <span class="btn-text">
                    收藏({{ info.subscribedCount | countFormat }})
                  </span>
                </button>
                <button v-else class="btn btn-white mleft-10" @click="subPlaylist(2)">
                   <i class="el-icon-folder-checked"></i>
                   <span class="btn-text">
                    已收藏({{ info.subscribedCount | countFormat }})
                   </span>
                </button>
                <button class="btn btn-white mleft-10">
                   <i class="iconfont icon-fenxiang"></i>
                   <span class="btn-text">
                    分享({{ info.shareCount | countFormat }})
                   </span>
                </button>
                <button
                class="btn btn-red mleft-10"
                @click="loadCompletePlayList"
                  v-show="isShowMoreBtn"
                >
                  <i class="el-icon-hot-water"></i>
                  <span class="btn-text">加载完整歌单</span>
                </button>
              </div>
              <div class="detail-tag font-14" v-if="tags.length !== 0">
                <span>标签 ：</span>
                <span
                  class="mright-10"
                  v-for="(val, index) in tags"
                  :key="index"
                >
                  {{ val }}
                </span>
              </div>
              <div class="num-info font-14">
                <span>歌曲 ：{{ info.trackCount }}</span>
                <span class="mleft-12"
                  >播放 ：{{ info.playCount | countFormat }}</span
                >
              </div>
              <div class="font-14">
                <el-collapse accordion>
                  <el-collapse-item class="brief">
                    <template slot="title">
                      简介:
                      <i class="header-icon el-icon-info"></i>
                    </template>
                    <div style="max-width: 1000px">
                      {{ info.description || "暂无简介" }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
          <div class="detail-topwrapper">
            <AlbumTabsMenu
                :menuList="['歌曲列表', `评论(${info.commentCount})`, '收藏者']"
                @menuClick="handMenuClick"
              >
              </AlbumTabsMenu>
              <div class="detail-search" v-show="showtab === 1">
              <el-input
                placeholder="搜索音乐"
                clearable
                suffix-icon="el-icon-search"
                v-model="key"
              ></el-input>
            </div>
          </div>
          <div v-show="showtab === 1">
            <MusicList ref="listRef" :list="list">
            </MusicList>
            <div v-if="isShowMoreBtn" class="flex-center more-btn">
              点击 <i class="el-icon-hot-water"></i>
              <span class="btn-text">加载完整歌单</span> 查看更多单曲
            </div>
          </div>
            <div v-show="showtab === 2">
              <coll-comment :active="showtab == 2"></coll-comment>
            </div>
            <div v-show="showtab === 3">
              <collectors></collectors>
            </div>
        </div>
      </template>
    </el-skeleton>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import AlbumTabsMenu from '@/components/menu/AlbumTabsMenu'
import Tag from '../../components/Tag/Tag'
import MusicList from '@/components/list/MusicList'
import CollComment from './PlayList/CollComment'
import Collectors from './PlayList/Collectors'
import { tranferMusicData, DEFAULT_KEY } from '../../utils/constant'
import { httpGet } from '@/utils/axios.js'

export default {
  name: 'PlayListDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    Tag,
    AlbumTabsMenu,
    MusicList,
    CollComment,
    Collectors
  },
  computed: {
    showEditIcon () {
      return (
        this.$store.state.isLogin &&
        this.$store.state.profile.userId === this.creator.userId &&
        this.info.specialType === 0
      )
    },
    subDisabled () {
      if (this.$store.state.isLogin) { return this.info.userId === this.$store.state.profile.userId } else { return false }
    },
    isShowMoreBtn () {
      return (
        this.playList.length < this.info.trackCount &&
        this.playList.length < 800
      )
    },
    ImgUrl () {
      return this.info.coverImgUrl ? `${this.info.coverImgUrl}` : ''
    },
    list () {
      return this.playList.filter((item) => item.musicName.match(this.key))
    }
  },
  watch: {
    id () {
      this.getPlayListDetail()
    }
  },
  data () {
    return {
      key: DEFAULT_KEY,
      info: {},
      showtab: 1,
      creator: {},
      tags: [],
      playList: [],
      type: false,
      subscribed: false,
      isLoading: true
    }
  },
  created () {
    this.getPlayListDetail()
  },
  methods: {
    getPlayListDetail () {
      this.isLoading = true
      httpGet(`/api/playlist/detail`, {
        id: this.id
      }, (res) => {
        if (res.data.code !== 200) { return }
        this.info = res.data.playlist
        this.creator = res.data.playlist.creator
        this.subscribed = res.data.playlist.subscribed
        this.tags = res.data.playlist.tags
        this.playList = res.data.playlist.tracks.map(item => {
          return tranferMusicData(item)
        })
      })
      this.isLoading = false
    },
    playClickAll () {
      let id = this.playList[0].id
      this.$store.commit('setMusicInfo', {
        musicList: this.playList,
        id
      })
    },
    subPlaylist (type) {
      if (!this.$store.state.isLogin) return this.$message.warning('需要登录')
      httpGet(`/api/playlist/subscribe?id=${this.id}&t=${type}`).then(res => {
        if (res.data.code !== 200) { return }
        this.subscribed = !this.subscribed

        if (type === 1) {
          this.$message.success('收藏成功')
        } else {
          this.$message.success('取消收藏成功')
        }
        setTimeout(() => {
          this.$store.dispatch('getMyPlayList')
        }, 1000)
      })
    },
    loadCompletePlayList () {
      let idArr = []
      this.info.trackIds.forEach((item) => {
        idArr.push(item.id)
      })
      httpGet(`/api/song/detail?ids=${idArr.join(',')}`).then((res) => {
        if (res.data.code !== 200) { return }
        this.playList = res.data.songs.map((item) => {
          return tranferMusicData(item)
        }
        )
        if (idArr.length > 800) {
          this.playList.slice(0, 800)
          this.$message.error('太多歌曲了，只加载一部分')
        }
      })
    },
    handMenuClick (type) {
      type = type + 1
      if (this.showtab === type) return
      this.showtab = type
    },
    toPlayListEdit () {
      this.$router.push('/playlistedit/' + this.id)
    },
    toUserDetail (item) {
      if (typeof item === 'object') {
        this.$router.push('/userdetail/' + item.userId)
      }
    }
  }
}
</script>

<style scoped>
.play-list-detail {
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
}
.detail-desc {
  display: flex;
}
.detail-img-wrapper {
  width: 180px;
  height: 180px;
}
.detail-desc-info {
  line-height: 24px;
  margin-left: 20px;
}
.author {
  margin: 5px 0;
  height: 24px;
  display: flex;
}
.author-img {
  height: 24px;
}
.info-btn {
  margin: 5px 0;
}
.more-btn {
  margin-top: 10px;
  font-size: 14px;
  color: #bbb;
}
.detail-topwrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.comment {
  background-color: #fff;
}
.backtop {
  right: 20px !important;
  bottom: 79px !important;
  }
</style>
