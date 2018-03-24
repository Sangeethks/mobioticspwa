<template>
  <div class="color-line lg"></div>
</template>

<script>
export default {
}
</script>

<style lang="css">
.color-line {
    top: 0;
    height: 3px;
    background: -webkit-linear-gradient(135deg,#fe0099,#ff072c,#fe9102)!important;
    background: linear-gradient(-45deg,#fe0099,#ff072c,#fe9102)!important;
    position: inherit;
}
.color-line.lg {
    height: 5px;
}
</style>
