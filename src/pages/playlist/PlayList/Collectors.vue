<template>
  <div>
      <el-skeleton v-if="isSubloading" :rows="6" animated />
            <div v-else-if="this.pageInfo.total === 0" class="flex-center">
              当前歌单没有收藏者
            </div>
            <template v-else>
              <FollowList
                :type="1"
                :list="suberList"
                @clickImg="toUserDetail"
              ></FollowList>
              <div class="flex-center" style="width: 100%">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="pageInfo.currentPage"
                  :page-size="30"
                  layout="prev, pager, next"
                  :total="pageInfo.total"
                  background
                >
                </el-pagination>
              </div>
            </template>
  </div>
</template>

<script>
import FollowList from './FollowList'
import { httpGet } from '@/utils/axios.js'
export default {
  name: 'Collectors',
  components: {FollowList},
  data () {
    return {
      suberList: [],
      pageInfo: {
        currentPage: 1,
        total: 0
      },
      isSubloading: true
    }
  },
  created () {
    this.getSuberList()
  },
  watch: {
    id () {
      if (this.showtab === 3) {
        this.isSubloading = true
        this.getSuberList()
      }
    }
  },
  methods: {
    getSuberList () {
      httpGet(`/api/playlist/subscribers`, {
        id: this.$route.params.id,
        limit: 30,
        offset: (this.pageInfo.currentPage - 1) * 30
      }, (res) => {
        if (res.data.code !== 200) { return }
        this.suberList = res.data.subscribers
        this.pageInfo.total = res.data.total
        this.isSubloading = false
      })
    },
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      document.querySelector('.el-main').scrollTop = 0
      this.getSuberList()
    },
    toUserDetail (item) {
      if (typeof item === 'object') { this.$router.push('/userdetail/' + item.userId) }
    }
  }
}
</script>

<style scoped>

</style>
