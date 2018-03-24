<template>
  <div class="alt-home">
    <home-nav></home-nav>

      <!-- <app-offline v-if="offline"></app-offline>
      <div v-else class="container">
        <home-featured></home-featured>
        <home-grid></home-grid>
      </div> -->
  </div>
</template>

<script>
import homeNav from './HomeNav.vue';

import { eventBus } from '@/main';
import  mxnUtilities  from '@/mixins/utilities';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// const homeFeatured = () => import (/* webpackChunkName: "home-Home-homeFeatured" */ './HomeFeatured.vue');
// const homeGrid = () => import (/* webpackChunkName: "home-Home-homeGrid */ './HomeGrid.vue');
// const Search = () => import (/* webpackChunkName: "home-Home-Search" */ '../shared/Search.vue');
// const Modals = () => import (/* webpackChunkName: "home-Home-Modals" */ '../shared/Modals.vue');
// const Header = () => import (/* webpackChunkName: "home-Home-Header" */ './Header.vue');
// const Offline = () => import (/* webpackChunkName: "home-Home-Offline" */ '../shared/Offline.vue');
// const AltSnackbar = () => import (/* webpackChunkName: "home-Home-AltSnackbar" */ '../popups/Snackbar.vue');


export default {
  data() {
    return {
      showSearch: false,
      showCreateKidsPin: false,
      offline: false,
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
      'recentWatchedItems',
    ]),
  },
  watch: {
    appActive() {
      this.setHomeHeader();
    },
    '$route'(to, from) {
      // console.log('[Home | watch | route ]');
      // console.log('[Home | to | ]', to);
      // console.log('[Home | from | ]', from);

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      // this.setHeaderTitle(to.name);
      this.createdChangeHeaderTitle(to.name);
    },
  },
  methods: {
    ...mapMutations([
    'setUserLoggedIn',
    'setRouterToParam',
    ]),
    createdChangeHeaderTitle(name) {
      // console.log('[createdChangeHeaderTitle | name | ]', name);
      // console.log('[createdChangeHeaderTitle | appActive | ]', this.appActive);

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      } else {
        altProfileMode = 'default';
        localStorage.setItem('altProfileMode', altProfileMode);
      }

      // NOTE: New code added
      // if (altProfileMode == 'kids') {
      //
      // } else {
      //     this.setHeaderTitle(name);
      //     this.toggleKidsLogo(false);
      //
      //     if (name == 'home') {
      //         this.setHeaderTitle(false);
      //         this.toggleDefaultLogo(true);
      //     }
      // }

      // NOTE: Code commented for testing
      if (this.appActive) {
        if (name == 'home') {
          this.setHeaderTitle(false);

          // console.log('[createdChangeHeaderTitle | altProfileMode | ]', altProfileMode);

          if (altProfileMode == 'default') {
            this.toggleDefaultLogo(true);
            this.toggleKidsLogo(false);
          } else {
            this.toggleDefaultLogo(false);
            this.toggleKidsLogo(true);
          }
        } else {
          this.setHeaderTitle(name);
        }
      } else {
        var defaultHeaderLogo = document.getElementById('header-logo-default');

        // console.log('[defaultHeaderLogo | ]', defaultHeaderLogo);
        if (name == 'home') {
          if (defaultHeaderLogo) {
            defaultHeaderLogo.style.display = 'inline';
          }
        } else {
          if (defaultHeaderLogo) {
            defaultHeaderLogo.style.display = 'none';
          }
        }
        // this.setHeaderTitle(name);
      }
      // NOTE: End of code commented
    },
    setHomeHeader() {
      this.createdChangeHeaderTitle(this.$route.name);

      this.toggleSearchIco(true);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);
    },
    homeAppModeChangeCB() {
      // this.createdChangeHeaderTitle('home');
      //
      // this.toggleSearchIco(true);
      // this.toggleDeleteIco(false);
      // this.toggleCloseIco(false);
    },
  },
  components: {
    'home-nav': homeNav,
    // 'home-header': Header,
    // 'home-search': Search,
    // 'app-offline': Offline,
    // 'home-featured': homeFeatured,
    // 'home-grid': homeGrid,
    // 'alt-modals': Modals,
    // 'alt-snackbar': AltSnackbar,
  },
  created() {
    // console.log('[Home | created ]');

    document.body.scrollTop = document.documentElement.scrollTop = 0;
    /**
    * search button click event listener
    */
    eventBus.$on('togglePopupSearch', (state) => {
      this.showSearch = state;
    });
    eventBus.$on('closeSearchEvent', () => {
      this.showSearch = false;
    });
    eventBus.$on('toggleCreateKidsPinEvent', (state) => {
      this.showCreateKidsPin = state;
    });
    eventBus.$on('toggleOfflineEvent', (state) => {
      this.offline = state;
    });
    eventBus.$on('toggleAppModeChangeEvent', this.homeAppModeChangeCB);

    var user = JSON.parse(localStorage.getItem('altUser'));
    if (user && user.email) {
      this.setUserLoggedIn(true);
    } else {
      this.setUserLoggedIn(false);
    }
  },
  mounted() {
    if (this.appActive) {
      this.setHomeHeader();

      let altApp = document.getElementById('alt-app');
      if (altApp) {
        altApp.style.position = 'relative';
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    // console.log('[Home | beforeRouteEnter | from ]', from);
    // console.log('[Home | beforeRouteEnter | to ]', to);

    var altProfileMode = undefined;
    if (localStorage.getItem('altProfileMode')) {
      altProfileMode = localStorage.getItem('altProfileMode');
    } else {
      altProfileMode = 'default';
      localStorage.setItem('altProfileMode', altProfileMode);
    }

    if (altProfileMode == 'kids') {
      if (to.name == 'home') {
        next();
      } else {
        next({ name: 'home' });
      }
    } else {
      next();
    }
  },
  beforeRouteLeave: (to, from, next) => {
    // console.log('[Home | beforeRouteLeave | to ]', to);
    // console.log('[Home | beforeRouteLeave | from ]', from);

    var altProfileMode = undefined;
    if (localStorage.getItem('altProfileMode')) {
      altProfileMode = localStorage.getItem('altProfileMode');
    } else {
      altProfileMode = 'default';
      localStorage.setItem('altProfileMode', altProfileMode);
    }

    if (altProfileMode == 'kids') {
      var accessibleRoutes = ['home', 'show', 'episode', 'media'];

      if (accessibleRoutes.indexOf(to.name) > -1) next();
    } else {
      next();
    }
  },
  mixins: [ mxnUtilities ]
}

</script>
