<template>
<div class="video-detail">
    <div class="vd-main">
        <div class="video-container">
            <div>
                <button class="no-btn font-16 font-bold mtop-10" @click="toVideo">
                    <i class="el-icon-arrow-left">{{ title }}</i>
                </button>
            </div>
            <div class="video-wrap mtop-10">
                <video autoplay controls :src="urlInfo.url">
                您的浏览器不支持 video 标签。
                </video>
            </div>
            <div class="info-wrap">
                <div class="creator-info">
                    <div class="img-wrap font-14">
                        <img class="pointer" :src="avatarUrl">
                        <span class="mleft-10 pointer">{{nickName}}</span>
                    </div>
                    <div class="font-14" v-if="type === 'v'">
                        <button
                        class="sub-btn pointer"
                        :class="{ isfollow: followed }"
                        @click="follow"
                        >
                        <template v-if="!followed">
                        <i class="el-icon-plus"></i> 关注
                        </template>
                        <template v-else> <i class="el-icon-check"></i> 已关注 </template>
                        </button>
                    </div>
                </div>
                <div class="video-info">
                <div class="font-18 mtop-10 font-bold">{{deTail.title || deTail.name}}</div>
                <div class="font-12 mtop-10" style="color: #cfcfcf">
                    <span>发布时间:{{ deTail.publishTime | dateFormat }}</span>
                    <span class="mleft-20">播放次数:{{  deTail.playTime || deTail.playCount | countFormat}}</span>
                </div>
                <div class="tag mtop-10">
                     <div v-for="tag in deTail.videoGroup" :key="tag.id">
                          <button class="tag-btn">{{ tag.name }}</button>
                     </div>
                </div>
                </div>
            </div>
            <div class="video-btn mtop-20">
                <button class="btn btn-white" @click="likeVideo">
                    <i
                    class="iconfont icon-good"
                    :class="{ icon_liked: countInfo.liked }"
                    >
                    </i>
                    <span class="btn-text">{{ likedInfo }}</span>
                    ({{ countInfo.likedCount }})
                </button>

                <button class="btn btn-white mleft-10" @click="subVideo">
                    <span v-show="!subed">
                    <i class="el-icon-folder-add"></i>
                    <span class="btn-text">收藏</span>
                    </span>
                    <span v-show="subed">
                    <i class="el-icon-folder-checked"></i>
                    <span class="btn-text">已收藏</span>
                    </span>
                    ({{ deTail.subscribeCount || deTail.subCount }})
                </button>
                <button class="btn btn-white mleft-10">
                    <i class="iconfont icon-fenxiang"></i>
                    <span class="btn-text">分享</span>
                    ({{ deTail.shareCount }})
                </button>
            </div>
        </div>
        <div class="comment-container">
            <div class="mbottom-10">
                 <span class="font-bold font-20">评论</span>
                 <span>({{ countInfo.commentCount }})</span>
            </div>
            <Comment
                :active="true"
                :type="resoureType"
                :id="id"
                scrollDom=".el-main"
                >
            </Comment>
        </div>
    </div>
    <div class="vd-right">
        <div class="recom">
        <div class="font-bold mtop-10">相关推荐</div>
         <div class="link mtop-10">
             <div v-for="(item, index) in RelatedList" :key="index" class="link-recom mtop-10">
                 <div class="link-img">
                     <img
                        @click="toVideoDetail(item)"
                        class="img-h img pointer"
                        :src="relatedImgUrl(item)"
                    />
                 </div>
                 <div class="xg-info mleft-10">
                    <div
                        class="mtop-10 font-14 title pointer"
                        @click="toVideoDetail(item)"
                    >
                        {{ item.title || item.name }}
                    </div>
                    <div class="font-12 mtop-10 pointer" style="color: #9f9f9f">
                        by {{ relatedNickName(item) }}
                    </div>
                    </div>
             </div>
         </div>
        </div>
    </div>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
</div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import Comment from '@/components/comment/Comment'
export default {
  name: 'VideoDetail',
  components: { Comment },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      deTail: {},
      urlInfo: {},
      RelatedList: [],
      countInfo: {
        likedCount: 0,
        shareCount: 0,
        commentCount: 0,
        liked: false
      },
      followed: false,
      subed: false
    }
  },
  computed: {
    title () {
      return this.type === 'v' ? '视频详情' : 'MV详情'
    },
    creator () {
      return (this.type === 'v' ? this.deTail.creator : (this.deTail.artists || [])[0]) || {}
    },
    avatarUrl () {
      return this.creator.avatarUrl || this.creator.img1v1Url
    },
    nickName () {
      return this.creator.nickname || this.creator.name
    },
    likedInfo () {
      return this.countInfo.liked ? '已赞' : '赞'
    },
    resoureType () {
      return this.type === 'v' ? 5 : 1
    }
  },
  watch: {
    id () {
      this.getDetail()
      this.getVideoUrl()
      this.getRelatedVideo()
      this.getVideoLike()
    },
    type: {
      immediate: true,
      handler (val) {
        if (val !== 'mv' && val !== 'v') this.$router.push('/404')
      }
    }
  },
  created () {
    this.getVideoDetail()
    this.getVideoUrl()
    this.getRelatedVideo()
    this.getVideoLike()
  },
  methods: {
    getVideoDetail () {
      if (this.type === 'mv') {
        httpGet(`/api/mv/detail?mvid=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          this.deTail = res.data.data
          this.subed = res.data.subed
        })
      }
      if (this.type === 'v') {
        httpGet(`/api/video/detail?id=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          this.deTail = res.data.data
          this.followed = res.data.data.creator.followed
        })
      }
    },
    getVideoUrl () {
      if (this.type === 'mv') {
        httpGet(`/api/mv/url?id=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          console.log(res, 'fr')
          this.urlInfo = res.data.data
          console.log(this.urlInfo, 'uil')
        })
      }
      if (this.type === 'v') {
        httpGet(`/api/video/url?id=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          this.urlInfo = res.data.urls[0]
        })
      }
    },
    getRelatedVideo () {
      if (this.type === 'v') {
        httpGet(`/api/related/allvideo?id=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          this.RelatedList = res.data.data
        })
      }
      if (this.type === 'mv') {
        httpGet(`/api/personalized/mv`).then(res => {
          if (res.data.code !== 200) { return }
          this.RelatedList = res.data.result
        })
      }
    },
    getVideoLike () {
      if (this.type === 'v') {
        httpGet(`/api/video/detail/info?vid=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          this.countInfo = res.data
        })
      }
      if (this.type === 'mv') {
        httpGet(`/api/mv/detail/info?mvid=${this.id}`).then(res => {
          if (res.data.code !== 200) { return }
          this.countInfo = res.data
        })
      }
    },
    likeVideo () {
      httpGet(`/api/resource/like?t=${this.countInfo.liked ? 0 : 1}&type=${this.resoureType}&id=${this.id}`).then(res => {
        if (res.data.code !== 200) { return }
        this.getVideoLike()
      })
    },
    follow () {
      httpGet(`/api/follow?id=${this.creator.userId}&t=${this.followed ? 0 : 1}`).then(res => {
        if (res.data.code !== 200) { return }
        this.$message.success(this.followed ? '取关成功' : '关注成功')
        this.followed = !this.followed
      })
    },
    subVideo () {
      if (this.type === 'v') {
        httpGet(`/api/video/sub?id=${this.id}&t=${this.subed ? 0 : 1}&type=${this.type}`).then(res => {
          if (res.data.code !== 200) { return }
          this.$message.success(this.subed ? '取消成功' : '收藏成功')
          this.subed = !this.subed
        })
      }
      if (this.type === 'mv') {
        httpGet(`/api/mv/sub?mvid=${this.id}&t=${this.subed ? 0 : 1}&type=${this.type}`).then(res => {
          if (res.data.code !== 200) { return }
          this.$message.success(this.subed ? '取消成功' : '收藏成功')
          this.subed = !this.subed
        })
      }
    },
    toVideoDetail (item) {
      if (this.type === 'v') {
        if (typeof vid !== 'undefined') {
          this.$router.push('/videodetail/v/' + item.vid)
        } else {
          if (typeof item.id !== 'undefined') { this.$router.push('/videodetail/mv/' + item.id) }
        }
      }
    },
    toUorADetail () {
      if (this.type === 'v') {
        if (typeof this.creator.userId !== 'undefined') {
          this.$router.push('/userdetail/' + this.creator.userId)
        } else {
          if (typeof this.creator.id !== 'undefined') {
            this.$router.push('/artistdetail/' + this.creator.id)
          }
        }
      }
    },
    relatedNickName (item) {
      if (item.creator) {
        return item.creator[0].userName
      }
      if (item.artists) {
        return item.artists[0].name
      }
      return ''
    },
    relatedImgUrl (item) {
      return item.coverUrl || item.picUrl
    },
    toVideo () {
      this.$router.push('/video')
    }
  }
}
</script>

<style scoped>
.video-detail {
margin: 0 auto;
display: flex;
justify-content: space-around;
}
.vd-main {
width: 700px;
}
.vd-right {
width: 400px;
}
.video-container .video-wrap video {
width: 600px;
height: 340px;
}
.no-btn {
color: #000;
}
.info-wrap .creator-info {
display: flex;
margin: 10px auto;
justify-content: space-between;
align-items: center;
height: 40px;
}
.img-wrap {
display: flex;
align-items: center;
}
.img-wrap img {
height: 40px;
width: 40px;
border-radius: 50%;
}
.sub-btn {
outline: none;
border: none;
background-color: #fcf4f4;
color: #ff3a3a;
height: 30px;
width: 80px;
border-radius: 15px;
}
.isfollow {
background-color: #f8f8f8;
color: #9b9b9b;
}
.video-info .tag {
display: flex;
flex-wrap: wrap;
}
li {
margin-right: 5px;
}
.tag-btn {
outline: none;
border: none;
height: 20px;
background-color: #f7f7f7;
color: #363636;
font-size: 12px;
border-radius: 10px;
}
.comment-container {
  margin-top: 20px;
}
.icon_liked {
  color: red;
}
.recom .link .link-recom{
display: flex;
}
.recom .link .link-recom .link-img {
width: 140px;
}
.recom .link-img img {
    border-radius: 4px;
}
.title {
width: 140px;
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
}
.backtop {
  right: 20px!important;
    bottom: 79px!important;
  }
</style>
