<template>
  <nav class="top-menu" v-if="homeSections">
    <a v-for="section in homeSections" v-if="section" class="scroll-menu" :key="section.id" @click="getSectionContents(section)" :class="getClassName(section)">{{section.titles.default}}</a>
  </nav>
</template>

<script>
import { eventBus } from '@/main';

export default {
  props: [
    'homeSections',
  ],
  watch: {
    homeSections (sections) {
      if (!(sections && sections.length)) return;

      // Sets the active section name
      this.activeSectionName = sections[0].titles.default;

      // Get the contents based on section
      this.getSectionContents(sections[0]);
    },
  },
  methods: {
    getSectionContents (section) {
      eventBus.$emit('getSectionContentsEvent', section);
    },
    getClassName (section) {
      return section.titles.default === this.activeSectionName ? 'active' : '';
    },
  },
  created () {

  },
}
</script>

<style lang="css">
.top-menu {
  overflow: auto;
  white-space: nowrap;
  border-bottom: 1px solid #2D2D2D;
  margin-bottom: 10px;
}
.scroll-menu {
    color: #FFF;
    padding: 12px 20px;
}
.active {
    border-bottom: 3px solid #ff0032;
}
.alt-tag, .detail ul li, .info-tags li, .one-third-card, .scroll-menu {
    display: inline-block;
}
.alt-tag, .scroll-menu, h2 {
    text-transform: uppercase;
}
.detail, .scroll-menu, a {
    text-decoration: none;
}
</style>
