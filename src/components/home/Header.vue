<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)" aria-label="showMenu" aria-labelledby="showMenu">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

            <h4 v-if="menuTitle" class="header-title">{{menuTitle}}</h4>
            <img v-else class="header-logo" src="../../assets/logo.svg" alt="header-logo" />
            <img class="header-ico" src="../../assets/lens.svg" @click="openSearch" alt="header-search" />
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { store } from '../../store/store'
import { altMixins } from '../../mixins'

const HeaderMenu = () => import (/* webpackChunkName: "home-Header-HeaderMenu" */ '../shared/HeaderMenu.vue');

// import HeaderMenu from '../shared/HeaderMenu.vue';

export default {
    computed: {
        ...mapGetters([
            'recentDeleteMode',
            'appActive',
            'menuTitle',
        ]),
    },
    watch: {
        '$route'(to, from) {
            this.setMenuTitleCB(true);
        },
        appActive() {
            this.setMenuTitleCB(false);
        },
    },
    methods: {
        ...mapMutations([
            'setRecentDeleteMode',
            'setMenuTitle',
            'setPageTitle',
        ]),
        goToSearch() {
            this.$router.push({ name: 'search' });
        },
        openSearch() {
            eventBus.$emit('togglePopupSearch', true);
        },
        setMenuTitleCB(state) {
            // console.log('[home | Header | watch | route | ]', this.$route);

            if (this.$route.name == 'home') {
                this.setMenuTitle(state ? 'HOME' : false);
                return;
            }
            this.setMenuTitle(this.$route.name.toUpperCase());
        },
    },
    components: {
        'header-menu': HeaderMenu,
    },
    created() {
        // console.log('[Home | Header | created ]');

        this.setMenuTitleCB();

        this.setRecentDeleteMode(false);
    },
    mixins: [altMixins],
}
</script>
