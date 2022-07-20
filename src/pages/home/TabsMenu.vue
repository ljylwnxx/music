<template>
  <div class="tabs-menu">
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabMenu"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="tab-content">
      <keep-alive>
        <compontent :is="currentName" :clickGo="clickGo"></compontent>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import PersonlRecommend from './HomePages/PersonlRecommend'
import PlayList from './HomePages/PlayList'
import TopList from './HomePages/TopList'
import ArtistList from './HomePages/ArtistList'
import NewMusic from './HomePages/NewMusic'
export default {
  name: 'TabsMenu',
  components: {
    PersonlRecommend,
    PlayList,
    TopList,
    ArtistList,
    NewMusic
  },
  data () {
    return {
      activeName:
      sessionStorage.getItem('person-recommned-active-name') || 'first',
      currentName: 'PersonlRecommend',
      tabMenu: [
        {
          label: '个性推荐',
          name: 'first',
          compoment: PersonlRecommend
        },
        {
          label: '歌单',
          name: 'second',
          compoment: PlayList
        },
        {
          label: '排行榜',
          name: 'third',
          compoment: TopList
        },
        {
          label: '歌手',
          name: 'forth',
          compoment: ArtistList
        },
        {
          label: '最新音乐',
          name: 'five',
          compoment: NewMusic
        }
      ]
    }
  },
  watch: {
    activeName: {
      handler: function (newVal) {
        sessionStorage.setItem('person-recommned-active-name', newVal)
        this.currentName = this.tabMenu.find(
          (item) => item.name === this.activeName
        ).compoment
      },
      immediate: true
    }
  },
  methods: {
    clickGo (activeName) {
      this.activeName = activeName
    }
  }
}
</script>

<style >
.tabs-menu {
  left: 200px;
  z-index: 99;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
</style>
