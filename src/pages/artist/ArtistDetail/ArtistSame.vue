<template>
  <div>
    <div v-if="sameArtistList.length === 0">没有相似歌手</div>
    <ImgList
      v-else
      @clickImg="toArtistDetail"
      :list="sameArtistList"
      type="artist"
    >
      <template v-slot="{ item }">
        <div class="text-hidden">
          {{ item.name }}
        </div>
      </template>
    </ImgList>
  </div>
</template>

<script>
import { httpGet } from '@/utils/axios.js'
import ImgList from '../../../components/list/ImgList.vue'
export default {
  components: { ImgList },
  name: 'ArtistSame',
  data () {
    return {
      sameArtistList: []
    }
  },
  created () {
    this.getArtistSame()
  },
  methods: {
    getArtistSame () {
      httpGet(`/api/simi/artist?id=${this.$route.params.id}`).then((res) => {
        if (res.data.code !== 200) { return }
        this.sameArtistList = res.data.artists
      })
    },
    toArtistDetail (id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    }
  }
}
</script>

<style>
</style>
