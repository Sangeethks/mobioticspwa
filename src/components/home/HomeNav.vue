<template>
  <nav class="top-menu" v-if="homeSections">
    <a v-for="menu in homeSections"  v-show="isShowHomeNav(menu)" class="scroll-menu" :class="isNavActive(menu.titles.default)" :key="menu.id" @click="setActiveSection(menu)">{{menu.titles.default}}</a>
  </nav>
</template>

<script>
import { eventBus } from '../../main';
// import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// import nav from'../../assets/js/navtoggle';

// const nav = () => import (/* webpackChunkName: "home-HomeNav-nav" */ '../../assets/js/navtoggle');

export default {
  data() {
    return {
      withUrl: false,
      param: undefined,
      activeSectionId: undefined,
      activeNavMenu: undefined,
      enableWatching: false,
    };
  },
  computed: {
    ...mapGetters([
      'appActive',
      'homeSectionId',
      'homeSections',
      'page',
      'limit',
      'offset',
      'homeActiveSectionTitle',
      'totalPages',
      'pageCount',
      'userLoggedIn',
      'recentWatchedItems',
      'showWatching',
    ]),
  },
  watch: {
    appActive() {
      // console.log('[HomeNav | watch | appActive ]');

      this.setActiveSectionId();
      this.initHomeNav();
    },
    '$route'(to, from) {
      // console.log('[HomeNav | watch | route ]');

      this.toggleLoader(true);
      this.setActiveSectionId();
      this.initHomeNav();
    },
  },
  methods: {
    ...mapMutations([
    'setHomeSections',
    'setOffset',
    'setLimit',
    'setPage',
    'setHomeContents',
    'setFirstContent',
    'setGridContents',
    'setTotalElements',
    'setTotalPages',
    'setHomeUrlQuery',
    'setPageCount',
    'setShowLoadMore',
    'setHomeActiveSectionTitle',
    'setRecentWatchedItems',
    'setShowWatching',
    ]),
    ...mapActions([
    'actGetSections',
    'actGetContentsByUrl',
    'actGetContentsById',
    'actGetRecentlyWatched',
    ]),
    setActiveSectionId() {
      // Get the config data from localstorage
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }
      // If config data is not available, return from the method
      if (!(altConfig)) return;

      // console.log('[HomeNav | setActiveSectionId | altConfig | ]', altConfig);

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

      // console.log('[HomeNav | setActiveSectionId | menus | ]', menus);
      // console.log('[HomeNav | setActiveSectionId | route | ]', this.$route);

      switch (this.$route.name) {
        case 'home':
        this.activeSectionId = getSectionId('Home');
        break;
        case 'shows':
        this.activeSectionId = getSectionId('Shows');
        break;
        case 'movies':
        this.activeSectionId = getSectionId('Movies');
        break;
        case 'kids':
        this.activeSectionId = getSectionId('Kids');
        break;
        case 'comedy':
        this.activeSectionId = getSectionId('Comedy');
        break;
        case 'bcl':
        this.activeSectionId = getSectionId('BCL');
        break;
        default:

      }

      // console.log('[HomeNav | setActiveSectionId | activeSectionId | ]', this.activeSectionId,this.$route.name);
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
    setActiveSection(menu) {
      // console.log('[HomeNav | setActiveSection | menu | ]', menu);

      eventBus.$emit('changeTemplateEvent', 'default');

      // Show the loader
      this.toggleLoader(true);
      // Reset the page count
      this.setPageCount(0);
      this.setLimit(7);
      this.setOffset(0);
      // Enable the load more button
      this.setShowLoadMore(true);

      this.setHomeActiveSectionTitle(menu.titles.default);
      // this.activeNavMenu = menu.titles.default;

      if (menu.external_id) {
        this.withUrl = true;
        this.param = menu.external_id;
      } else {
        this.withUrl = false;
        this.param = menu.id;
      }

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        // AWS Event for category select
        var catSelectEventAttributeObj = this.getAWSMACommonAttributes();
        catSelectEventAttributeObj.category_title = menu.titles && menu.titles.default ? menu.titles.default : 'N.A';
        catSelectEventAttributeObj.category_id  = menu.section_id ? menu.section_id : 'N.A';
        catSelectEventAttributeObj.category_url = menu._links && menu._links.self && menu._links.self.href ? menu._links.self.href : 'N.A';
        window.mobileAnalyticsClient.recordEvent('_category.select', catSelectEventAttributeObj, {});

        // AWS Event for section view
        var sectionViewEventAttributeObj = this.getAWSMACommonAttributes();
        sectionViewEventAttributeObj.section_title = (menu.titles && menu.titles.default) ? menu.titles.default : 'N.A';
        sectionViewEventAttributeObj.section_id = menu.id ? menu.id : 'N.A';
        window.mobileAnalyticsClient.recordEvent('_section.view', sectionViewEventAttributeObj, {});

        // window.mobileAnalyticsClient.recordEvent('_section.view', this.stuffSectionViewAttributes( menu.titles.default, menu.id), {});
      }
      // End of AWS Mobile SDK Events

      this.setHomeUrlQuery({ withUrl: this.withUrl, param: this.param });

      this.getContents();
    },  //  setActiveSection ends
    initHomeNav() {
      this.actGetSections(this.activeSectionId).then((response) => {
        // console.log('[HomeNav | initHomeNav | response | ]', response);

        // Returns the sections in order
        var homeSections = this.processSections(response);

        // console.log('[HomeNav | initHomeNav | homeSections | ]', homeSections);

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // If userdata is there, Check whether recent items are there and create mediaProgressList
        if (altUser) {
          // Get recently watched item from API response
          this.hasRecentItem().then(() => {
            // After that doing the rest of the process
            // Like setting the home sections as mutations
            this.setHomeSections(homeSections);
            // And setting the active section
            this.getActiveSection();
          }).catch((error) => {
            // console.log('[HomeNav | initHomeNav | hasRecentItem | error | ]', error);

            if (error.code && (error.code == 401 || error.code == 404)) {
              // Clear all the user related data
              // this.clearUserData();

              // Show the device removed popup
              eventBus.$emit('togglePopupDeviceRemoved', true);
            }

            // If recent items are not present
            var watchingIndex = homeSections.findIndex((item) => {
              return item.titles.default == 'Watching';
            });

            // console.log('[watchingIndex | ]', watchingIndex);

            if (watchingIndex == -1) {
              this.setHomeSections(homeSections);
              this.getActiveSection();
            } else {
              // strip out the watching section
              homeSections.splice(watchingIndex, 1);

              this.setHomeSections(homeSections);
              this.getActiveSection();
            }
          });
        } else {
          // If user data not available

          this.setHomeSections(homeSections);
          this.getActiveSection();
        }
      }, (error) => {
        // console.log('[initHomeNav | actGetSections | error | ]', error);
      });
    },
    getActiveSection() {
      var currSection = this.homeSections[0];

      // console.log('[initHomeNav | getActiveSection | currSection | ]', currSection);

      this.setHomeActiveSectionTitle(currSection.titles.default);

      if (currSection.external_id) {
        this.param = currSection.external_id;
        this.withUrl = true;
      } else {
        this.withUrl = false;
        this.param = currSection.id;
      }

      this.setHomeUrlQuery({ withUrl: this.withUrl, param: this.param });

      this.getContents();
    },
    getContents() {
      this.setPageCount(0);

      if (this.withUrl) {
        // Reset the page
        this.setPage(1);
        // Reset the offset
        this.setOffset(0);

        var domain = localStorage.getItem('visitedDomain');

        var urlObj = {
          url: this.param,
          requestObj: {
            params: {
              domain,
              timestamp: Math.floor(new Date() / 1000)
            }
          }
        };

        if (this.homeActiveSectionTitle == 'Watching') {
          this.setLimit(50);

          urlObj.requestObj.params.offset = this.offset;
          urlObj.requestObj.params.limit = this.limit;
        } else {
          this.setLimit(7);

          urlObj.requestObj.params.page = this.page;
          urlObj.requestObj.params.size = this.limit;
        }

        this.actGetContentsByUrl(urlObj).then((response) => {
          // console.log('[getContents | actGetContentsByUrl | response | ]', response);

          eventBus.$emit('toggleOfflineEvent', false);

          this.processContents(response);
        }, (error) => {
          // console.log('[getContents | actGetContentsByUrl | error | ]', error);
          //
          // var altProfileMode = undefined;
          // if (localStorage.getItem('altProfileMode')) {
          //     altProfileMode = localStorage.getItem('altProfileMode');
          // }

          if (error.code == 401) {
            eventBus.$emit('togglePopupDeviceRemoved', true);
          }

          this.toggleLoader(false);
          // eventBus.$emit('toggleOfflineEvent', true);
        });
      } else {
        /**
        * setting the offset
        */
        this.setOffset(0);
        /**
        * [action | home.js]
        */
        this.actGetContentsById({
          id: this.param,
          offset: this.offset,
          limit: this.limit,
        }).then(
        (response) => {
          // console.log('[getContents | actGetContentsById | response | ]', response);

          eventBus.$emit('toggleOfflineEvent', false);
          this.processContents(response);
        },
        (error) => {
          this.toggleLoader(false);
          eventBus.$emit('toggleOfflineEvent', true);
        }
        );
      }
    },
    processContents(response) {
      // console.log('[HomeNav | processContents | response]', response);
      // console.log('[HomeNav | processContents | limit]', this.limit);

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

        // console.log('[HomeNav | processContents | content | totalElements]', totalElements);
        // console.log('[HomeNav | processContents | content | totalPages]', totalPages);

      } else if (response.elements) {
        if (response.elements.media) {
          contents = response.elements.media;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);

          // console.log('[HomeNav | processContents | elements.media | totalElements]', totalElements);
          // console.log('[HomeNav | processContents | elements.media | totalPages]', totalPages);

        } else if (response.elements.series) {
          contents = response.elements.series;
          totalElements = response.elements.count;
          totalPages = Math.ceil(response.elements.count / this.limit);

          // console.log('[HomeNav | processContents | elements.series | totalElements]', totalElements);
          // console.log('[HomeNav | processContents | elements.series | totalPages]', totalPages);

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

      // console.log('[HomeNav | processContents | contents | ]', contents);

      if (contents && contents.length) {

        // console.log('[HomeNav | processContents | mediaProgressList]', mediaProgressList);

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
        // console.log('[No watching]');

        this.hasContents = false;
      }

      // console.log('[HomeNav | processContents | parsedContents]', parsedContents);

      this.setHomeContents(parsedContents);
      this.setFirstContent(parsedContents.slice(0, 1)[0]);
      this.setGridContents(parsedContents.slice(1));
      this.setTotalElements(totalElements);
      this.setTotalPages(totalPages);

      // console.log('[HomeGrid | firstContent | ]', this.firstContent);
      // console.log('[HomeGrid | gridContents | ]', this.gridContents);

      // console.log('[HomeGrid | totalPages | ]', this.totalPages);
      // console.log('[HomeGrid | pageCount | ]', this.pageCount);

      if (this.totalPages == 1) {
        this.setShowLoadMore(false);
      } else {
        this.setShowLoadMore(true);
      }

      // console.log('[HomeNav | Hide the loader]');

      // hide the loader
      this.toggleLoader(false);
    },
    stuffCommonAttributes() {
      var localAttributeObj = {}
      var geo_location = localStorage.getItem('geo_location');
      var altConfig = JSON.parse(localStorage.getItem('altConfig'));

      if (geo_location) {
        geo_location = JSON.parse(geo_location);
        localAttributeObj = geo_location;
      }
      localAttributeObj.user_email = localStorage.getItem('user_email');
      localAttributeObj.user_id = localStorage.getItem('account_id');
      localAttributeObj.user_session = localStorage.getItem('token');
      localAttributeObj.user_name = localStorage.getItem('user_name');
      localAttributeObj.user_dob = localStorage.getItem('user_birthday');
      localAttributeObj.user_gender = localStorage.getItem('user_gender');
      localAttributeObj.app_env = altConfig.environment.title;

      return localAttributeObj;
    },
    stuffSectionViewAttributes(sectionTitle, sectionId) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.section_title = sectionTitle;
      eventAttributeObj.section_id = sectionId.toString();

      return eventAttributeObj;
    },
    processSections(sections) {
      if (sections && sections.length) {
        return sections.sort((a, b) => {
          return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);
        });
      }
    },
    isNavActive(name) {
      return (this.homeActiveSectionTitle == name ? 'active' : '');
    },
    getWatchingContents() {
      this.toggleLoader(true);
      this.getWatching();
    },
    getWatching() {
      this.setShowLoadMore(false);
      this.setHomeActiveSectionTitle('watching');

      this.actGetRecentlyWatched({ limit: 20, offset: 0 }).then((response) => {
        // console.log('[HomeNav | getWatching | response | ]', response);
        // console.log('[HomeNav | getWatching | history | ]', response.history);

        if (response.count) {
          var recentWatchedItemsArr = new Array();
          var mediaProgressList = new Array();

          for (var i in response.history) {
            var watchedItem = this.parseContents(response.history[i].media);

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
              altProfileMode = localStorage.getItem('altProfileMode')
            }

            // console.log('[HomeNav | getWatching | altProfileMode | ]', altProfileMode);
            // console.log('[HomeNav | getWatching | watchedItem | ]', watchedItem);

            if (altProfileMode == 'kids') {
              if (!(watchedItem.kidsContent)) continue;
            }

            var length = (response.history[i].media.details && response.history[i].media.details.length) ? response.history[i].media.details.length : undefined;

            var progress = false;
            if (length && response.history[i].playback_progress) {
              progress = Math.ceil((response.history[i].playback_progress / length) * 100);
            }
            progress = (progress > 100) ? 100 : progress;

            var media_id = response.history[i].media.id;
            mediaProgressList.push({ media_id, progress, length });

            // console.log('[HomeNav | getWatching | playback progress | ]', response.history[i].playback_progress);
            // console.log('[HomeNav | getWatching | duration | ]', watchedItem.durationInSec);


            watchedItem.progress = undefined;
            if (response.history[i].playback_progress == 0) {
              watchedItem.progress = 100;
            } else if (response.history[i].playback_progress !== undefined) {
              watchedItem.progress = Math.ceil((response.history[i].playback_progress / watchedItem.durationInSec) * 100);
            }

            watchedItem.progress = (watchedItem.progress > 100) ? 100 : watchedItem.progress;
            // console.log('[HomeNav | getWatching | watchedItem | ]', watchedItem);
            // console.log('[HomeNav | getWatching | watchedItem.progress | ]', watchedItem.progress);

            recentWatchedItemsArr.push(watchedItem);
          }

          // console.log('[HomeNav | getWatching | recentWatchedItemsArr | ]', recentWatchedItemsArr);
          // console.log('[HomeNav | getWatching | mediaProgressList | ]', mediaProgressList);

          //  NOTE 19.12.2017 commented by sumit for kid section data not loding in mediaProgressList

          //localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));

          this.setHomeContents(recentWatchedItemsArr);
          this.setFirstContent(recentWatchedItemsArr.slice(0, 1)[0])
          this.setGridContents(recentWatchedItemsArr.slice(1));

          this.toggleLoader(false);
        } else {
          this.setShowWatching(false);
          var currSection = this.homeSections[0];

          // console.log('[HomeNav | getWatching | else | currSection | ]', currSection);

          this.setHomeActiveSectionTitle(currSection.titles.default);

          if (currSection.external_id) {
            this.param = currSection.external_id;
            this.withUrl = true;
          } else {
            this.withUrl = false;
            this.param = currSection.id;
          }

          this.setHomeUrlQuery({ withUrl: this.withUrl, param: this.param });

          this.getContents();
        }
      }, (error) => {
        if (error.code == 401 && error.status == 'error') {
          localStorage.removeItem('altUser');
          this.getContents();
        }
      });
    },
    // NOTE: Methods added as part of enhancement
    // (Enhancement) Making the watching tab to the end of the section
    // (Added by) Sangeeth 31-11-17
    isShowHomeNav(menu) {
      // console.log('[HomeNav | menu | ]', menu);

      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }

      // console.log('[HomeNav | altUser | ]', altUser);

      if (altUser) {
        return true;
      } else {
        return menu.visible == 'true' ? true : false;
      }
    },
    hasRecentItem() {
      var self = this;

      // Initially make the mediaProgressList empty
      localStorage.setItem('mediaProgressList', JSON.stringify([]));

      return new Promise(function(resolve, reject) {
        self.actGetRecentlyWatched({ limit: 20, offset: 0 }).then((response) => {
          // console.log('[HomeNav | hasRecentItem | response | ]', response);

          if (response.count) {
            var mediaProgressList = new Array();
            var watchingList = new Array();

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
              altProfileMode = localStorage.getItem('altProfileMode');
            } else {
              altProfileMode = 'default';
              localStorage.setItem('altProfileMode');
            }

            for (var i in response.history) {
              var watchedItem = self.parseContents(response.history[i].media);

              if (altProfileMode == 'kids') {
                if (!watchedItem.kidsContent) continue;
              }

              watchingList.push(watchedItem);

              var length = (response.history[i].media.details && response.history[i].media.details.length) ? response.history[i].media.details.length : undefined;

              var progress = false;
              if (length && response.history[i].playback_progress) {
                progress = Math.ceil((response.history[i].playback_progress / length) * 100);
              }
              progress = (progress > 100) ? 100 : progress;

              var media_id = response.history[i].media.id;
              mediaProgressList.push({ media_id, progress, length });
            }

            // console.log('[HomeNav | getWatching | recentWatchedItemsArr | ]', recentWatchedItemsArr);
            // console.log('[HomeNav | getWatching | watchingList | ]', watchingList);
            // console.log('[HomeNav | getWatching | mediaProgressList | ]', mediaProgressList);

            if (!watchingList || !watchingList.length) {
              reject(true);
            }

            //  NOTE 19.12.2017 commented by sumit for kid section data not loding in mediaProgressList
            localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));

            resolve(true);
          } else {
            reject(true);
          }
        }, (error) => {
          // console.log('[getRecentWatched | error | ]', error);

          reject(error);
        });
      });
    },
    // NOTE: End of Methods added as part of enhancement
    popupDefaultDeviceRemovedCB(state) {
      // console.log('[HomeNav | popupDefaultDeviceRemovedCB | ]');

      // If popup payload is true, return from method
      if (state) return;

      this.initHomeNav();
    },
    homeNavAppModeChangeCB(state) {
      // console.log('[HomeNav | appModeChangeCB | ]');

      this.setActiveSectionId();
      this.initHomeNav();
    },
  },
  created() {
    this.toggleLoader(true);

    eventBus.$on('toggleAppModeChangeEvent', this.homeNavAppModeChangeCB);
    eventBus.$on('togglePopupDefaultDeviceRemoved', this.popupDefaultDeviceRemovedCB);

    if (this.appActive) {
      // console.log('[HomeNav | created | appActive ]');

      this.setActiveSectionId();
      this.initHomeNav();
    }
  },
  beforeDestroy() {
    // eventBus.$off('toggleAppModeChangeEvent');
    eventBus.$off('toggleAppModeChangeEvent', this.homeNavAppModeChangeCB);
    eventBus.$off('togglePopupDefaultDeviceRemoved');
  },
  // mixins: [altMixins]
}
</script>
