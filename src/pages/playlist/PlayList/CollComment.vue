<template>
  <div class="collcomment">
    <Comment
      :type="2"
      :id="$route.params.id"
      scrollDom=".el-main"
      :scrollOffset="80"
    ></Comment>
  </div>
</template>

<script>
import Comment from '../../../components/comment/Comment'
export default {
  name: 'CollComment',
  components: {
    Comment
  }
}
</script>

<style scoped>
</style>
