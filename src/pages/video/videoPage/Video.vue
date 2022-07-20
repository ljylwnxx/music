<template>
  <div class="video">
    <div class="list-tag mtop-10">
      <div class="layer-wrapper">
        <el-popover
          placement="bottom-start"
          trigger="manual"
          v-model="visible"
          :popper-options="{
            boundariesElement: '.layer-wrapper',
            gpuAcceleration: false,
          }"
        >
          <el-button
            slot="reference"
            class="circle-btn tag-btn"
            @click="visible = !visible"
          >
            {{ videoTagBtn }}
            <i class="el-icon-arrow-right"></i>
          </el-button>
          <div class="layer">
            <div class="h-60">
              <button
                class="no-btn"
                :class="{ isActive: currenTagId === 0 }"
                @click="selectAll"
              >
                全部视频
              </button>
            </div>
            <div class="div-line"></div>
            <div class="tag-list">
              <div
                class="list-text"
                v-for="(a, index) in allTagList"
                :key="a.id"
              >
                <button
                  @click="selectAllTag(a.id, index)"
                  class="no-btn"
                  :class="{ isActive: a.selectTab }"
                >
                  {{ a.name }}
                </button>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="hot-tag mtop-10">
        <div
          class="hot-tag-name mright-10 font-12"
          v-for="(h, index) in hotTagList"
          :key="h.id"
          :class="{ isActive: h.selectTab }"
          @click="selectHotTag(h.id, index)"
        >
          {{ h.name }}
        </div>
      </div>
    </div>
    <VideoList
      @loadMore="load"
      :disabled="disabled"
      :type="listType"
      :list="videoList"
    >
    </VideoList>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import VideoList from './VideoList'
import {
  DEFAULT_OFFSET,
  MODE_FIRST,
  DEFAULT_HASMORE,
  DEFAULT_ISLOADING,
  DEFAULT_VISIBLE
} from '../../../utils/constant'
export default {
  name: 'Video',
  components: { VideoList },
  data () {
    return {
      visible: DEFAULT_VISIBLE,
      videoTagBtn: '全部视频',
      allTagList: [],
      hotTagList: [],
      videoList: [],
      listType: 'video',
      hasMore: DEFAULT_HASMORE,
      isLoading: DEFAULT_ISLOADING,
      mode: MODE_FIRST,
      currenTagId: 0,
      offset: DEFAULT_OFFSET
    }
  },
  computed: {
    disabled () {
      return this.loading || !this.hasMore
    }
  },
  created () {
    this.getVideo()
    this.getHotTag()
    this.getVideoAlltag()
  },
  methods: {
    getHotTag () {
      httpGet(`/api/video/category/list`).then((res) => {
        if (res.data.code !== 200) {
          return
        }
        this.hotTagList = res.data.data
      })
    },
    getVideoAlltag () {
      httpGet(`/api/video/group/list`).then((res) => {
        if (res.data.code !== 200) {
          return
        }
        this.allTagList = res.data.data
        this.allTagList.forEach((item) => {
          item.selectTab = item.id === this.currenTagId
        })
      })
    },
    getVideo () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      if (this.mode === MODE_FIRST) {
        this.offset = DEFAULT_OFFSET
      }
      if (this.currenTagId === 0) {
        httpGet(`/api/video/timeline/all?offset=${this.offset}`)
          .then((res) => {
            if (res.data.code !== 200) {
              return
            }
            if (this.mode === MODE_FIRST) {
              this.videoList = res.data.datas
              this.hasMore = res.data.hasmore
              if (this.videoList.length === 0) {
                this.$message.error('暂时没有推荐视频，请稍后再试')
              }
            } else {
              this.videoList.push(...res.data.datas)
            }
            this.hasMore = res.data.hasmore
          })
      } else {
        httpGet(`/api/video/group?id=${this.currenTagId}&offset=${this.offset}`)
          .then((res) => {
            if (res.data.code !== 200) {
              return
            }
            if (this.mode === MODE_FIRST) {
              this.videoList = res.data.datas
              this.hasMore = res.data.hasmore
            } else {
              this.videoList.push(...res.data.datas)
              this.hasMore = res.data.hasmore
            }
          })
      }
      this.isLoading = false
    },
    selectAllTag (id, index) {
      id === 1000 ? (this.listType = 'mv') : (this.listType = 'video')
      this.allTagList.forEach((item) => {
        item.selectTab = false
      })
      this.hotTagList.forEach((item) => {
        item.selectTab = false
        item.selectTab = item.id === id
      })
      this.allTagList[index].selectTab = true
      this.videoTagBtn = this.allTagList[index].name
      this.visible = !this.visible
      this.currenTagId = id
      this.mode = MODE_FIRST
      this.getVideo()
    },
    selectHotTag (id, index) {
      id === 1000 ? (this.listType = 'mv') : (this.listType = 'video')
      this.hotTagList.forEach((item) => {
        item.selectTab = false
      })
      this.allTagList.forEach((item) => {
        item.selectTab = false
        item.selectTab = item.id === id
      })
      this.hotTagList[index].selectTab = true
      this.videoTagBtn = this.hotTagList[index].name
      this.currenTagId = id
      this.mode = MODE_FIRST
      this.getVideo()
    },
    selectAll () {
      this.videoTagBtn = '全部视频'
      this.visible = !this.visible
      this.currenTagId = 0
      this.hotTagList.selectTab = false
      this.mode = MODE_FIRST
      this.getVideo()
    },
    load (size) {
      if (this.isLoading) {
        return
      }
      if (!this.hasMore) {
        return this.$message.info('已经到底了')
      }
      this.offset = size + 8
      this.mode = 'more'
      this.getVideo()
    }
  }
}
</script>

<style scoped>
.layer {
  background-color: #ffffff;
  z-index: 99;
  border-radius: 4px;
  font-size: 14px;
  height: 400px;
  overflow-y: scroll;
}
.list-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  width: 600px;
  margin: 0 auto;
}
.list-text {
  width: 100px;
  height: 26px;
  text-align: center;
  margin: 16px 0;
}
.layer .h-60 {
  line-height: 60px;
  padding-left: 20px;
}
.hot-tag {
  display: flex;
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  cursor: pointer;
}
.hot-tag-name {
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  cursor: pointer;
}
.picimages {
  display: flex;
  flex-wrap: wrap;
}
.img-item-li {
  width: 250px;
  height: 210px;
  padding: 10px 20px;
}
.isActive {
  background-color: #fdf5f5;
  color: #ec4141;
  border-radius: 13px;
}
.no-btn {
  width: 100px;
  cursor: pointer;
  padding: 6px 10px;
}
.no-btn:hover {
  color: #ec4141;
}
.backtop {
  right: 20px !important;
  bottom: 79px !important;
}
</style>
