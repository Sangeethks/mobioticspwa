<template>
  <div class="alt-loader" id="alt-loader">
    <div class="loading">
      <div class="inner"></div>
    </div>
  </div>

</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
.alt-loader {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #000;
  top: 0;
  z-index: 9999;
}
.loading {
  position: relative;
  width: 56px;
  height: 56px;
  margin: 0 auto;
  top: 50%;
}
.inner {
  animation-duration: 1s;
  -webkit-animation-duration: 1s;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  animation-timing-function: linear;
  -webkit-animation-timing-function: linear;
  animation-name: rotate-inner;
  -webkit-animation-name: rotate-inner;
}
.inner, .loading:after {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.loading:after {
  content: " ";
  margin: 10%;
  border-radius: 100%;
  background: #000;
}
.inner:after, .inner:before {
  position: absolute;
  top: 0;
  bottom: 0;
  content: " ";
}
.inner:before {
  left: 0;
  right: 50%;
  border-radius: 72px 0 0 72px;
}
.inner:before {
  background-image: linear-gradient(45deg,#fe0099,#ff072c,#fe9102);
}
.inner:after {
  left: 50%;
  right: 0;
  border-radius: 0 72px 72px 0;
}
.inner:after {
  background: #000;
}
</style>
