<template>
  <div class="mtop-20 all-mv">
     <div class="all-title font-20 font-bold">全部MV</div>
     <div class="tag-wrapper" ref="tagRef">
         <div class="radio-list">
             <span class="w-60">地区：</span>
                <el-radio-group v-model="queryInfo.area">
                    <el-radio
                    :label="ar"
                    v-for="(ar, index) in catList.area"
                    :key="index">
                        {{ar}}
                    </el-radio>
                </el-radio-group>
          </div>
          <div class="radio-list">
               <span class="w-60">类型：</span>
               <el-radio-group v-model="queryInfo.type">
                   <el-radio :label="tp" v-for="(tp,index) in catList.type" :key="index">
                       {{tp}}
                   </el-radio>
               </el-radio-group>
          </div>
          <div class="radio-list">
                <span class="w-60">排序：</span>
                <el-radio-group v-model="queryInfo.order">
                <el-radio
                    :label="od"
                    v-for="(od, index) in catList.order"
                    :key="index"
                    >
                    {{od}}
                </el-radio>
                </el-radio-group>
          </div>
     </div>
    <MvList :list="mvList" :disabled="disabled" @loadMore="load"></MvList>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import MvList from '@/components/list/MvList'
import {DEFAULT_OFFSET, MODE_FIRST, DEFAULT_HASMORE} from '../../../../utils/constant'
export default {
  name: 'AllMv',
  components: { MvList },
  data () {
    return {
      catList: {
        area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
        type: ['全部', '官方版', '原生', '现场版', '网易出品'],
        order: ['上升最快', '最热', '最新']
      },
      queryInfo: {
        area: '全部',
        type: '全部',
        order: '最新',
        limit: 16
      },
      offset: DEFAULT_OFFSET,
      mvList: [],
      hasMore: DEFAULT_HASMORE,
      isLoading: false,
      mode: MODE_FIRST
    }
  },
  computed: {
    disabled () {
      return this.loading || !this.hasMore
    }
  },
  watch: {
    queryInfo: {
      deep: true,
      handler () {
        this.mode = MODE_FIRST
        this.getMvList()
      }
    }
  },
  created () {
    this.getQuery()
    this.getMvList()
  },
  methods: {
    getMvList () {
      httpGet(`/api/mv/all?limit=16&offset=0&area=${this.queryInfo.area}&order=${this.queryInfo.order}&type=${this.queryInfo.type}`).then((res) => {
        if (res.data.code !== 200) {
          return
        }
        this.mode === MODE_FIRST ? (this.mvList = res.data.data) : (this.mvList.push(...res.data.data))
        this.hasMore = res.data.hasMore
      })
    },
    getQuery () {
      let query = this.$route.query
      if (
        query.area &&
        this.catList.area.findIndex((item) => item === query.area) !== -1
      ) {
        this.queryInfo.area = query.area
      }
      if (
        query.type &&
        this.catList.type.findIndex((item) => item === query.type) !== -1
      ) {
        this.queryInfo.type = query.type
      }
    },
    load (length) {
      this.offset = length + 16
      this.mode = 'more'
      this.getMvList()
    }
  }
}
</script>

<style scoped>
  .all-mv {
      margin-left: 30px;
  }
  .radio-list {
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  margin-top: 10px;
  }
  span {
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
.backtop {
  right: 20px !important;
  bottom: 79px !important;
}
</style>
