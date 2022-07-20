<template>
  <div class="comment">
      <div class="area-wrap">
       <textarea
       class="text-area"
       ref="textAreaRef"
       v-model="commentInfo.content"
       @keyup.enter="sendComment"
       >

       </textarea>
        <div class="word-num">{{ restNum }}</div>
      </div>
       <div class="btn-wrap mtop-10">
      <div class="at-btn">
        <button class="font-18 no-btn" @click="commentInfo.content += '@'">
          @
        </button>
        <button class="font-18 no-btn" @click="addTopic">#</button>
      </div>
      <div class="send-btn">
        <button class="btn btn-white" @click="sendComment">评论</button>
      </div>
    </div>
      <div class="hot-wrap mtop-20" v-if="hotList.length !== 0">
          <div class="font-16 font-bold">精彩评论</div>
          <CommentItem
          v-for="item in hotList"
          :key="item.commentId"
          :item="item"
           identy="hot"
            @clickUser="toUserDetail"
        >
        </CommentItem>
        <div class="more-btn-wrap mtop-20">
          <button class="btn btn-white">更多精彩评论></button>
        </div>
      </div>
      <div ref="newListRef" class="hot-wrap mtop-20" v-if="newList.length !== 0">
        <div class="font-16 font-bold">最新评论({{ newCount }})</div>
        <CommentItem
        v-for="item in newList"
        :key="item.commentId"
        :item="item"
        identy="new"
         @clickUser="toUserDetail"
      >
      </CommentItem>
      <div class="flex-center" style="margin-top: 10px">
         <el-pagination
         @current-change="handleChangePage"
         :current-page="currentPage"
          :page-size="20"
          layout="prev, pager, next"
          :total="newCount"
          background
        >
        </el-pagination>
      </div>
      </div>
      <div v-if="newCount === 0" style="color: #9f9f9f; text-align: center">
      还没有评论，快来抢沙发~
      </div>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import CommentItem from '../../components/comment/CommentItem'
import {commentObj} from './index'
export default {
  name: 'Comment',
  components: { CommentItem },
  props: {
    id: {
      type: [Number, String],
      required: false
    },
    type: {
      type: Number,
      required: true
    },
    scrollDom: {
      type: String,
      require: true,
      default: 'body'
    },
    scrollOffset: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      hotList: [],
      newList: [],
      newCount: 0,
      currentPage: 1,
      newQuery: {
        id: this.id,
        offset: 0,
        limit: 20,
        before: 0,
        type: this.type
      },
      commentInfo: {
        t: 1,
        type: this.type,
        id: this.id,
        content: '',
        commentId: 0
      },
      reply: ''
    }
  },
  computed: {
    restNum () {
      return 140 - this.commentInfo.content.length
    }
  },
  watch: {
    active: {
      immediate: true,
      handler (val) {
        if (!val || this.newList.length !== 0) return
        this.getHotComment()
        this.getNewComment()
      }
    },
    'commentInfo.content' (val) {
      if (val === '') {
        this.commentInfo.t = 1
      }
    },
    id (val) {
      if (!val) return
      this.hotList = []
      console.log('监听ID', val, this.commentInfo.id)
      this.commentInfo.id = val
      this.newQuery.id = val
      this.clearCommentInfo()
      this.getHotComment()
      this.getNewComment()
    }
  },
  created () {
    this.getHotComment()
    this.getNewComment()
    this.sendComment(this.commentInfo)
  },
  methods: {
    clearCommentInfo () {
      this.replyName = ''
      this.commentInfo.content = ''
      console.log('重置评论')
      this.commentInfo.commentId = 0
      this.commentInfo.t = 1
    },
    getHotComment () {
      httpGet(`/api/comment/hot?id=${this.id}&type=${this.type}`).then(res => {
        if (res.data.code !== 200) { return }
        this.hotList = res.data.hotComments
      })
    },
    getNewComment () {
      commentObj[this.type](this.newQuery).then(res => {
        if (res.data.code !== 200) { return }
        this.newCount = res.data.total
        this.newList = res.data.comments
      })
    },
    handleChangePage (val) {
      this.currentPage = val
      this.newQuery.offset = (val - 1) * 20
      this.getNewComment(this.newQuery)
      document.querySelector(this.scrollDom).scrollTop = 0
      document.querySelector(this.scrollDom).scrollTop = this.$refs.newListRef.offsetTop - this.scrollOffset
    },
    addTopic () {
      this.commentInfo.content += '#输入想说的话题#'
    },
    sendComment () {
      if (this.restNum < 0) return this.$message.error('字数过长')
      httpGet(`/api/comment?t=1&type=${this.type}&id=${this.id}&content=${this.commentInfo.content}&commentId=0`).then(res => {
        if (res.data.code !== 200) { return }
        this.$message.success('发送成功')
        // res.data.message = this.commentInfo.content
        this.commentInfo.content = ''
        this.commentInfo.t = 1
        this.commentInfo.commentId = 0
        console.log('刷新新列表')
        if (this.newQuery.offset === 0) {
          window.setTimeout(() => {
            this.getNewComment()
          }, 500)
        }
      })
    },
    toUserDetail (id) {
      if (typeof id !== 'number') { return }
      if (this.$route.path !== '/userdetail/' + id) { this.$router.push('/userdetail/' + id) }
    }
  }
}
</script>

<style scoped>
.area-wrap {
  display: flex;
   flex-wrap: wrap;
    flex-direction: column;
    align-content: space-around;
}
.text-area {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    border: 1px solid #e5e5e5;
    outline: none;
    font-size: 14px;
    border-radius: 4px;
    padding: 4px 10px;
    resize: none;
    word-break: break-all;
    word-wrap: break-word;
  }
   .word-num {
    color: #dfcfdf;
  }
  .btn-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.more-btn-wrap {
  text-align: center;
}
</style>
