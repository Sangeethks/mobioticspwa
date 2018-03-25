<template>
  <div class="alt-home">
    <home-nav :homeSections="homeSections"></home-nav>

    <template v-for="(content, index) in contents">
      <!-- <tile-featured v-if="index === 0" :content="content" :key="content.id"></tile-featured>

      <tile-one-by-three v-else :content="content" :key="content.id"></tile-one-by-three> -->
      <component :is="getTileName(index)" :key="index" :content="content"></component>
    </template>
  </div>
</template>

<script>
import HomeNav from './HomeNav.vue';
import TileFeatured from './TileFeatured.vue';
import TileOneByThree from './TileOneByThree.vue';

import { eventBus } from '@/main';
import  mxnUtilities  from '@/mixins/utilities';
import  mxnMedia  from '@/mixins/media';
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
      homeSections: undefined,
      contents: undefined,
    };
  },
  components: {
    'home-nav': HomeNav,
    'tile-featured': TileFeatured,
    'tile-one-by-three': TileOneByThree,
  },
  computed: {
    ...mapGetters([
      'appActive',
    ]),
  },
  created() {
    eventBus.$on('getSectionContentsEvent', this.getSectionContentsCB);

    if (!this.appActive) return;

    this.initHome();
  },
  watch: {
    appActive() {
      this.initHome();
    },
  },
  methods: {
    ...mapMutations([

    ]),
    ...mapActions([
      'actGetSections',
      'actGetContentsByUrl',
    ]),
    initHome () {
      // Get the sectionID of Home Page
      let activeSectionID = this.getActiveSectionID();

      this.actGetSections(activeSectionID).then((response) => {
        let altUser = localStorage.getItem('altUser');

        this.homeSections = response.filter((section) => altUser ? section : section.visible === 'true');
      }, (error) => {
        // console.log('[initHomeNav | actGetSections | error | ]', error);
      });
    },
    getActiveSectionID () {
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
      // If config data is not available, return from the method
      if (!(altConfig)) return;

      var altProfileMode = undefined;
      if (localStorage.getItem('altProfileMode')) {
        altProfileMode = localStorage.getItem('altProfileMode');
      }

      if (altProfileMode == 'kids') {
        this.activeSectionId = altConfig.kids.sectionID;
        return;
      }

      // Get the menu data from the altConfig
      var menus = undefined;
      if (altConfig && altConfig.menus) {
        menus = altConfig.menus;
      }

      switch (this.$route.name) {
        case 'home':
        return getSectionId('Home');
        break;
        case 'shows':
        return getSectionId('Shows');
        break;
        case 'movies':
        return getSectionId('Movies');
        break;
        case 'kids':
        return getSectionId('Kids');
        break;
        case 'comedy':
        return getSectionId('Comedy');
        break;
        case 'bcl':
        return getSectionId('BCL');
        break;
        default:
        return undefined;
      }

      this.sendGTMpageViewData(this.$route.name);

      function getSectionId(name) {
        var matchedMenus = menus.filter((menu) => {
          return menu.title == name;
        });

        // If no menus are found while filtering, return undefined -
        // so that the execution won't continue.
        if (!(matchedMenus && matchedMenus.length)) return undefined;

        // If matched menu is found return the section id
        return matchedMenus[0].sectionID;
      }
    },
    getSectionContentsCB (section) {
      if (section.external_id) {
        this.getListByURL(section.external_id);
      } else {
        this.getListByID(section.id);
      }
    },
    getListByURL (url) {
      this.actGetContentsByUrl(url).then((response) => {
        this.processContents(response);
      }, (error) => {
        if (error.code == 401) {
          eventBus.$emit('togglePopupDeviceRemoved', true);
        }
        this.toggleLoader(false);
      });
    },
    getListByID (id) {
      console.log('[Home -> getListByID -> id]', id);

    },
    processContents(response) {
      var contents = undefined;
      var totalElements = undefined;
      var totalPages = undefined;
      /**
      * determining the content according to the type of response coming
      */
      if (response.content) {
        contents = response.content;
        totalElements = response.totalElements;
        totalPages = response.totalPages;
      } else if (response.elements) {
        if (response.elements.media) {
          contents = response.elements.media;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);
        } else if (response.elements.series) {
          contents = response.elements.series;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);
        }
      } else if (response.history) {
        contents = response.history;
        totalElements = response.count;
        totalPages = totalPages = Math.ceil(response.count / this.limit);
      }
      /**
      * creating new array for storing the parsed contents
      */
      var parsedContents = new Array();

      if (contents && contents.length) {
        var altProfileMode = undefined;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        }

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        var mediaProgressList = undefined;
        if (localStorage.getItem('mediaProgressList')) {
          mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
        }

        for (var i in contents) {
          var parsedObject = undefined;

          if (contents[i].media) {
            parsedObject = this.parseContents(contents[i].media);
          } else {
            parsedObject = this.parseContents(contents[i]);
          }

          if (altUser && mediaProgressList && mediaProgressList.length) {
            for (var j in mediaProgressList) {
              if (parsedObject.contentId && mediaProgressList[j].media_id == parsedObject.contentId) {
                parsedObject.progress = mediaProgressList[j].progress;
                break;
              }
            }
          }

          parsedContents.push(parsedObject);
        }
      } else {
        this.hasContents = false;
      }

      this.contents = parsedContents;

      eventBus.$emit('toggleAppLoaderEvent', false);
    },
    getTileName (index) {
      return index === 0 ? 'tile-featured' : 'tile-one-by-three';
    },
  }, // methods
  mixins: [ mxnUtilities, mxnMedia ]
}

// export default {
//   data() {
//     return {
//       showSearch: false,
//       showCreateKidsPin: false,
//       offline: false,
//     };
//   },
//   components: {
//     'home-nav': HomeNav,
//     // 'home-header': Header,
//     // 'home-search': Search,
//     // 'app-offline': Offline,
//     // 'home-featured': homeFeatured,
//     // 'home-grid': homeGrid,
//     // 'alt-modals': Modals,
//     // 'alt-snackbar': AltSnackbar,
//   },
//   computed: {
//     ...mapGetters([
//       'appActive',
//       'recentWatchedItems',
//     ]),
//   },
//   watch: {
//     appActive() {
//       this.setHomeHeader();
//     },
//     '$route'(to, from) {
//       // console.log('[Home | watch | route ]');
//       // console.log('[Home | to | ]', to);
//       // console.log('[Home | from | ]', from);
//
//       var altProfileMode = undefined;
//       if (localStorage.getItem('altProfileMode')) {
//         altProfileMode = localStorage.getItem('altProfileMode');
//       } else {
//         altProfileMode = 'default';
//         localStorage.setItem('altProfileMode', altProfileMode);
//       }
//
//       // this.setHeaderTitle(to.name);
//       this.createdChangeHeaderTitle(to.name);
//     },
//   },
//   methods: {
//     ...mapMutations([
//     'setUserLoggedIn',
//     'setRouterToParam',
//     ]),
//     createdChangeHeaderTitle(name) {
//       // console.log('[createdChangeHeaderTitle | name | ]', name);
//       // console.log('[createdChangeHeaderTitle | appActive | ]', this.appActive);
//
//       var altProfileMode = undefined;
//       if (localStorage.getItem('altProfileMode')) {
//         altProfileMode = localStorage.getItem('altProfileMode');
//       } else {
//         altProfileMode = 'default';
//         localStorage.setItem('altProfileMode', altProfileMode);
//       }
//
//       // NOTE: New code added
//       // if (altProfileMode == 'kids') {
//       //
//       // } else {
//       //     this.setHeaderTitle(name);
//       //     this.toggleKidsLogo(false);
//       //
//       //     if (name == 'home') {
//       //         this.setHeaderTitle(false);
//       //         this.toggleDefaultLogo(true);
//       //     }
//       // }
//
//       // NOTE: Code commented for testing
//       if (this.appActive) {
//         if (name == 'home') {
//           this.setHeaderTitle(false);
//
//           // console.log('[createdChangeHeaderTitle | altProfileMode | ]', altProfileMode);
//
//           if (altProfileMode == 'default') {
//             this.toggleDefaultLogo(true);
//             this.toggleKidsLogo(false);
//           } else {
//             this.toggleDefaultLogo(false);
//             this.toggleKidsLogo(true);
//           }
//         } else {
//           this.setHeaderTitle(name);
//         }
//       } else {
//         var defaultHeaderLogo = document.getElementById('header-logo-default');
//
//         // console.log('[defaultHeaderLogo | ]', defaultHeaderLogo);
//         if (name == 'home') {
//           if (defaultHeaderLogo) {
//             defaultHeaderLogo.style.display = 'inline';
//           }
//         } else {
//           if (defaultHeaderLogo) {
//             defaultHeaderLogo.style.display = 'none';
//           }
//         }
//         // this.setHeaderTitle(name);
//       }
//       // NOTE: End of code commented
//     },
//     setHomeHeader() {
//       this.createdChangeHeaderTitle(this.$route.name);
//
//       this.toggleSearchIco(true);
//       this.toggleDeleteIco(false);
//       this.toggleCloseIco(false);
//     },
//     homeAppModeChangeCB() {
//       // this.createdChangeHeaderTitle('home');
//       //
//       // this.toggleSearchIco(true);
//       // this.toggleDeleteIco(false);
//       // this.toggleCloseIco(false);
//     },
//   },
//   created() {
//     // console.log('[Home | created ]');
//
//     document.body.scrollTop = document.documentElement.scrollTop = 0;
//     /**
//     * search button click event listener
//     */
//     eventBus.$on('togglePopupSearch', (state) => {
//       this.showSearch = state;
//     });
//     eventBus.$on('closeSearchEvent', () => {
//       this.showSearch = false;
//     });
//     eventBus.$on('toggleCreateKidsPinEvent', (state) => {
//       this.showCreateKidsPin = state;
//     });
//     eventBus.$on('toggleOfflineEvent', (state) => {
//       this.offline = state;
//     });
//     eventBus.$on('toggleAppModeChangeEvent', this.homeAppModeChangeCB);
//
//     var user = JSON.parse(localStorage.getItem('altUser'));
//     if (user && user.email) {
//       this.setUserLoggedIn(true);
//     } else {
//       this.setUserLoggedIn(false);
//     }
//   },
//   mounted() {
//     if (this.appActive) {
//       this.setHomeHeader();
//
//       let altApp = document.getElementById('alt-app');
//       if (altApp) {
//         altApp.style.position = 'relative';
//       }
//     }
//   },
//   beforeRouteEnter: (to, from, next) => {
//     // console.log('[Home | beforeRouteEnter | from ]', from);
//     // console.log('[Home | beforeRouteEnter | to ]', to);
//
//     var altProfileMode = undefined;
//     if (localStorage.getItem('altProfileMode')) {
//       altProfileMode = localStorage.getItem('altProfileMode');
//     } else {
//       altProfileMode = 'default';
//       localStorage.setItem('altProfileMode', altProfileMode);
//     }
//
//     if (altProfileMode == 'kids') {
//       if (to.name == 'home') {
//         next();
//       } else {
//         next({ name: 'home' });
//       }
//     } else {
//       next();
//     }
//   },
//   beforeRouteLeave: (to, from, next) => {
//     // console.log('[Home | beforeRouteLeave | to ]', to);
//     // console.log('[Home | beforeRouteLeave | from ]', from);
//
//     var altProfileMode = undefined;
//     if (localStorage.getItem('altProfileMode')) {
//       altProfileMode = localStorage.getItem('altProfileMode');
//     } else {
//       altProfileMode = 'default';
//       localStorage.setItem('altProfileMode', altProfileMode);
//     }
//
//     if (altProfileMode == 'kids') {
//       var accessibleRoutes = ['home', 'show', 'episode', 'media'];
//
//       if (accessibleRoutes.indexOf(to.name) > -1) next();
//     } else {
//       next();
//     }
//   },
//   mixins: [ mxnUtilities ]
// }

</script>
