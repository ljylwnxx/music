<template>
  <div class="new-album">
    <div class="new-song-view">
      <div class="new-album-list">
        <div class="time-info">
          <div class="time-info-content">本周新碟</div>
        </div>
        <div class="data-list">
          <ImgList @clickImg="toAlbumDetail" :list="weekData" type="album">
            <template v-slot="{ item }">
              <div class="text-hidden">
                {{ item.name }}
              </div>
              <div style="color: #9f9f9f" class="text-hidden">
                {{ item.artist.name }}
              </div>
            </template>
          </ImgList>
        </div>
      </div>
    </div>
    <el-backtop target=".el-main" class="backtop"></el-backtop>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import ImgList from '../../../../components/list/ImgList.vue'
export default {
  components: { ImgList },
  name: 'NewAlbum',
  data () {
    return {
      weekData: [],
      queryInfo: {
        limit: 30,
        offset: 0,
        area: 'ALL',
        type: 'new',
        month: '',
        year: ''
      }
    }
  },
  created () {
    this.getNewAlbum()
  },
  methods: {
    getNewAlbum () {
      httpGet(`/api/top/album?limit=30&offset=0&area=ALL&type=new&year=&month=`).then((res) => {
        let weekData = res.data.weekData
        this.weekData = weekData
      })
    },
    toAlbumDetail (id) {
      if (typeof id === 'number') this.$router.push('/albumdetail/' + id)
    }
  }
}
</script>

<style scoped>
.new-album-list {
  display: flex;
  width: 100%;
}
.time-info {
  width: 50px;
  text-align: center;
}
.time-info-content {
  font-size: 20px;
  width: 30px;
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
