<template>
  <div class="artist-list">
    <div class="tag-wrapper" ref="tagRef">
      <div class="radio-list">
        <span class="w-60">语种：</span>
        <el-radio-group v-model="queryInfo.area">
          <el-radio :label="ar.id" v-for="ar in artistData.area" :key="ar.id">
            {{ ar.value }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">分类：</span>
        <el-radio-group v-model="queryInfo.type">
          <el-radio :label="tp.id" v-for="tp in artistData.type" :key="tp.id">
            {{ tp.value }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">筛选：</span>
        <el-radio-group v-model="queryInfo.initial">
          <el-radio
            :label="it.id"
            v-for="it in artistData.initial"
            :key="it.id"
          >
            {{ it.value }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <ImgList
      @clickImg="toArtistDetail"
      :list="picList"
      :hasMore="hasMore"
      :infinite="true"
      type="artist"
    >
      <template v-slot="{ item }">
        <div class="text-hidden">
          {{ item.name }}
        </div>
      </template>
    </ImgList>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import ImgList from '../../../components/list/ImgList'
import {QUERYINFO_INITIAL, QUERYINFO_TYPE, QUERYINFO_AREA, ARTIST_QUERYINFO_LIMIT} from './constant'
import { MODE_FIRST, DEFAULT_OFFSET } from '../../../utils/constant'
const artistData = require('@/assets/json/artistData')
export default {
  name: 'ArtistList',
  components: {
    ImgList
  },
  data () {
    return {
      queryInfo: {
        limit: ARTIST_QUERYINFO_LIMIT,
        area: QUERYINFO_AREA,
        offset: DEFAULT_OFFSET,
        type: QUERYINFO_TYPE,
        initial: QUERYINFO_INITIAL
      },
      artistData,
      picList: [],
      mode: MODE_FIRST,
      hasMore: true
    }
  },
  created () {
    this.getQueryInfo()
  },
  watch: {
    queryInfo: {
      deep: true,
      handler () {
        this.getQueryInfo()
      }
    }
  },
  methods: {
    getQueryInfo () {
      httpGet(`/api/artist/list?limit=30&offset=0&type=${this.queryInfo.type}&area=${this.queryInfo.area}&initial=${this.queryInfo.initial}`)
        .then((res) => {
          if (res.data.code !== 200) { return }
          this.picList = res.data.artists
          if (this.mode === MODE_FIRST) {
            this.picList = res.data.artists
          } else {
            this.picList.push(...res.data.artists)
          }
        })
    },
    toArtistDetail (id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    }
  }
}
</script>

<style>
.radio-list {
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  margin-top: 10px;
}
.radio-list span {
  height: 30px;
  line-height: 30px;
}
.el-radio-group {
  width: 80%;
}
.el-radio {
  width: 60px;
  height: 30px;
  line-height: 30px;
}
.picimages {
  display: flex;
  flex-wrap: wrap;
}
.backtop {
  right: 20px !important;
  bottom: 79px !important;
}
</style>
