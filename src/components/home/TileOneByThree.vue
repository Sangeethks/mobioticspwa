<template>
  <div class="one-by-three">
    <div class="one-thirds">
      <div v-if="content">
        <div class="one-third-card">

          <img v-if="content && content.images && content.images.poster" :src="content.images.poster" alt="alt-poster">

          <div v-else class="color-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'content'
  ]
}
</script>

<style lang="css" scoped>
.one-by-three {
    width: calc(33.33% - 14px);
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
}
.one-by-three:nth-child(3n) {
    margin-left: 12px;
}
</style>
