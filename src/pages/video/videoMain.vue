<template>
  <div class="video-view">
    <div class="tab-list">
      <video-tabs-menu></video-tabs-menu>
    </div>
  </div>
</template>

<script>
import videoTabsMenu from './videoTabsMenu'
export default {
  name: 'videoPage',
  components: {
    videoTabsMenu
  }
}
</script>

<style scoped>
.video-view {
    height: 100%;
    width: 90%;
    margin: 0 auto;
    max-width: 1200px;
}
</style>
