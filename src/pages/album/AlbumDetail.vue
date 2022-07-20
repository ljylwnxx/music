<template>
  <div class="album-detail mtop-20">
    <div class="detail-desc">
      <div class="detail-img-wrapper">
        <img class="img image-radius-8 image-border" :src="albumInfo.picUrl" />
      </div>
      <div class="detail-desc-info">
        <div class="info-title">
          <Tag text="专辑"></Tag>
          <span class="mleft-12 font-20 font-bold">{{ albumInfo.name }}</span>
        </div>
        <div class="info-btn">
          <button class="btn btn-red" @click="playAll">
            <i class="iconfont icon-bofang"></i>
            <span class="btn-text">播放全部</span>
          </button>
          <button
            v-if="!isSub"
            class="btn btn-white mleft-10"
            @click="subAlbum(1)"
          >
            <i class="el-icon-folder-add"></i>
            <span class="btn-text"> 收藏({{ subCount | countFormat }}) </span>
          </button>
          <button v-else class="btn btn-white mleft-10" @click="subAlbum(0)">
            <i class="el-icon-folder-checked"></i>
            <span class="btn-text">
              已收藏 ({{ subCount | countFormat }})
            </span>
          </button>
          <button class="btn btn-white mleft-10">
            <i class="iconfont icon-fenxiang"></i>
            <span class="btn-text"> 分享({{ shareCount | countFormat }}) </span>
          </button>
        </div>
        <div class="author font-14">
          <span>歌手：</span>
          <span
            class="pointer author-name"
            v-for="a in albumInfo.artists"
            :key="a.id"
            @click="toArtistDetail(a.id)"
            >{{ a.name }}
          </span>
        </div>
         <div class="">
          <span class="font-14">
            时间：{{ albumInfo.publishTime | dateFormat }}</span
          >
        </div>
      </div>
    </div>
      <div class="detail-head">
      <AlbumTabsMenu
        :menuList="['歌曲列表', '评论', '专辑详情']"
        @menuClick="handMenuClick"
      >
      </AlbumTabsMenu>
    </div>
     <MusicList v-show="showtab === 1" ref="listRef" :list="list"></MusicList>
      <Comment
      v-show="showtab == 2"
      :active="showtab == 2"
      :type="3"
      :id="$route.params.id"
      scrollDom=".el-main"
    ></Comment>
    <div v-show="showtab == 3">
      <div class="font-bold">专辑介绍</div>
      <div class="my-pre" v-if="description.length !== 0">
        <p v-for="(item, index) in description" :key="index">
          {{ item }}
        </p>
      </div>
      <div v-else style="text-align: center">没有专辑详情</div>
    </div>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import Tag from '../../components/Tag/Tag'
import AlbumTabsMenu from '../../components/menu/AlbumTabsMenu'
import MusicList from '../../components/list/MusicList'
import Comment from '../../components/comment/Comment'
import {tranferMusicData} from '../../utils/constant'
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
    Comment
  },
  watch: {
    id () {
      this.getAlbumDetail()
    }
  },
  computed: {
    description () {
      return this.albumInfo.description
        ? this.albumInfo.description.split('\n')
        : []
    }
  },
  data () {
    return {
      albumInfo: {},
      list: [],
      isSub: false,
      shareCount: 0,
      commentCount: 0,
      subCount: 0,
      showtab: 1
    }
  },
  created () {
    this.getAlbumDetail()
    this.getAlbumDynamic()
  },
  methods: {
    getAlbumDetail () {
      httpGet(`/api/album?id=${this.id}`).then((res) => {
        if (res.data.code !== 200) { return }
        this.albumInfo = res.data.album
        this.list = res.data.songs.map(item => {
          return tranferMusicData(item)
        })
      })
    },
    getAlbumDynamic () {
      httpGet(`/api/album/detail/dynamic?id=${this.id}`).then((res) => {
        if (res.data.code !== 200) { return }
        this.isSub = res.data.isSub
        this.shareCount = res.data.shareCount
        this.commentCount = res.data.commentCount
        this.subCount = res.data.subCount
      })
    },
    subAlbum () {
      httpGet(`/api/album/sub?id=${this.id}&t=${!this.isSub ? 1 : 0}`).then((res) => {
        if (res.data.code !== 200) { return }
        this.isSub = !this.isSub
        if (!this.isSub) {
          this.$message.error('取消成功')
        } else {
          this.$message.success('收藏成功')
        }
      })
    },
    playAll () {
      this.$refs.listRef.playClickAll()
    },
    handMenuClick (val) {
      this.showtab = val + 1
    },
    toArtistDetail (id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    }
  }
}
</script>

<style scoped>
.album-detail {
    height: 100%;
    width: 90%;
    margin: 0 auto;
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
.author-name {
        color: #3771dd;
}
  .detail-desc .detail-desc-info .author .author-name::after {
    display: inline;
    color: #000;
    margin: 4px;
    content: '/';
}
.detail-desc .detail-desc-info .author .author-name:last-child::after {
    content: '';
}
.info-btn {
  margin: 5px 0;
}
.more-btn {
  margin-top: 10px;
  font-size: 14px;
  color: #bbb;
}
.detail-head {
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
}
.my-pre {
  text-indent: 2em;
  line-height: 2;
  width: 100%;
}
  p {
    color: #676767;
  }
  .backtop {
  right: 20px!important;
    bottom: 79px!important;
  }
</style>
