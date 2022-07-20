<template>
  <div class="video-tabs-menu">
    <div class="tab">
      <el-tabs v-model="activeName" >
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
      <compontent :is="currentName"></compontent>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Video from './videoPage/Video'
import mv from './videoPage/mv/mv'
export default {
  name: 'TabsMenu',
  components: {
    Video,
    mv
  },
  data () {
    return {
      activeName: sessionStorage.getItem('video-main-active-name') || 'first',
      currentName: 'Video',
      tabMenu: [
        {
          label: '视频',
          name: 'first',
          compoment: Video
        },
        {
          label: 'MV',
          name: 'second',
          compoment: mv
        }
      ]
    }
  },
  watch: {
    activeName: {
      handler: function (newVal) {
        sessionStorage.setItem('video-main-active-name', newVal)
        this.currentName = this.tabMenu.find(
          (item) => item.name === this.activeName
        ).compoment
      },
      immediate: true
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
