<template>
  <div class="feat-card">
    <div class="detail" v-if="content">
      <h2 v-if="content.title">{{content.title}}</h2>
      <p v-if="content.shortDescription" class="short-desc">{{content.shortDescription}}</p>
      <ul class="info-tags">
        <li v-if="content.seasonNumber && !content.noShow">S{{content.seasonNumber}}</li>
        <li v-if="content.episodeNumber && !content.noShow">E{{content.episodeNumber}}</li>
        <li v-if="content.contentTitle && !content.episodeNumber">{{content.contentTitle}}</li>
        <li v-if="content.duration">{{content.duration}}</li>
        <li v-if="content.mainCategoryName">{{content.mainCategoryName}}</li>
        <li v-if="content.mainLanguage">{{content.mainLanguage}}</li>
      </ul>
    </div>

    <img v-if="content && content.images && content.images.cover" :src="content.images.cover" alt="alt-cover">

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
.feat-card {
    background: #f0f0f0;
    background-size: cover;
    position: relative;
    margin-bottom: 10px;
    overflow: hidden;
}
.detail {
    position: absolute;
    bottom: 0;
    width: calc(100% - 20px);
    color: #fff;
    text-align: left;
    text-decoration: none;
    padding: 50px 10px 10px;
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJod…IgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2dyYWQtdWNnZy1nZW5lcmF0ZWQpIiAvPgo8L3N2Zz4=);
    background: linear-gradient(180deg,transparent 0,rgba(0,0,0,.97) 88%,#000 91%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#00000000",endColorstr="#000000",GradientType=0);
    z-index: 99;
}
.alt-tag {
    padding: 2px 4px;
    border: 1px solid red;
    border-radius: 5px;
    background-color: rgba(0,0,0,.4);
    color: #FFF;
    font-size: 9px;
    margin: 4px 0;
}
.alt-tag, .scroll-menu, h2 {
    text-transform: uppercase;
}
h2 {
    font-size: 18px;
    font-weight: 900;
    color: #fff;
}
.detail p.short-desc, h2, li, ul {
    margin: 0;
}
.detail ul {
    width: 100%;
    float: left;
    margin: 2px 0 4px;
    padding: 0;
}
.info-tags, li, ul {
    list-style: none;
    padding: 0;
}
.info-tags li:first-child {
    margin: 0;
}
.detail ul li {
    border-right: 1px solid #BBB;
    padding-right: 10px;
    margin-right: 5px;
    margin-bottom: 0!important;
    line-height: 13px;
    font-size: 12px;
    color: #FFF;
    width: auto;
    float: none;
    text-transform: capitalize;
}
.alt-tag, .detail ul li, .info-tags li, .one-third-card, .scroll-menu {
    display: inline-block;
}
</style>
