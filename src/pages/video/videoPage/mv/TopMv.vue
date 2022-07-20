<template>
  <div class="mtop-20 top-mv">
    <div class="font-20 font-bold">MV排行榜</div>
    <div class="top-mv-head">
      <div class="font-12" style="color: #9f9f9f">最近更新：今天</div>
      <div class="btn-wrap">
        <button
          class="btn-tag"
          v-for="item in areaList"
          :key="item"
          :class="{ 'btn-tag_active': area_active(item) }"
          @click="changeArea(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
     <MvTopList :list="list"></MvTopList>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import MvTopList from '@/components/list/MvTopList'
import {DEFAULT_OFFSET} from '../../../../utils/constant'
export default {
  name: 'TopMv',
  components: { MvTopList },
  data () {
    return {
      areaList: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      area: '全部',
      queryInfo: {
        limit: 50,
        offset: DEFAULT_OFFSET,
        area: ''
      },
      list: []
    }
  },
  created () {
    if (
      this.$route.query.area &&
      this.areaList.findIndex((item) => item === this.$route.query.area) !== -1
    ) {
      this.area = this.$route.query.area
      this.queryInfo.area = this.area
    }
    this.getTopData()
  },
  methods: {
    area_active (item) {
      return this.area === item
    },
    changeArea (area) {
      this.area = area
      this.queryInfo.area = area !== '全部' ? area : ''
      this.getTopData()
    },
    getTopData () {
      httpGet(`/api/top/mv?area=${this.queryInfo.area}&limit=${this.queryInfo.limit}&offset=0`).then(res => {
        if (res.data.code !== 200) {
          return
        }
        this.list = res.data.data
      })
    }
  }
}
</script>

<style scoped>
.top-mv {
    margin-left: 30px;
}
.top-mv-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.area_active {
  font-weight: bold;
}
.btn-tag {
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  outline: 0;
  border: 0;
  background-color: #fff;
  padding: 0 10px;
  cursor: pointer;
  color: #676767;
}
.btn-tag_active {
  color: #ec4141;
  background-color: #fdf5f5;
}
</style>
