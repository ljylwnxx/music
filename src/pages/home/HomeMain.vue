<template>
  <div class="home-view">
    <div class="tab-list">
      <tabs-menu></tabs-menu>
    </div>
  </div>
</template>

<script>
import TabsMenu from './TabsMenu.vue'
export default {
  name: 'HomeMain',
  components: {
    TabsMenu
  }
}
</script>

<style>
.home-view {
    height: 100%;
    width: 90%;
    margin: 0 auto;
    max-width: 1200px;
}
</style>
