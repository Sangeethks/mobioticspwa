<template>
  <div id="alt-app">
    <router-view></router-view>
    <app-loader v-show="showAppLoader"></app-loader>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { eventBus } from '@/main';
import AppLoader from '@/components/shared/AppLoader.vue';

export default {
  name: 'app',
  data () {
    return {
      showAppLoader: true,
    };
  },
  created () {
    this.initApp();

    eventBus.$on('toggleAppLoaderEvent', state => { this.showAppLoader = state });
  },
  components: {
    'app-loader': AppLoader,
  },
  methods: {
    ...mapMutations([
      'setAppActive',
      'setBaseUrl',
      'setAltMessages',
      'setAltSubsPageMessages',
    ]),
    ...mapActions([
      'actGetConfig',
      'actGetDomain',
      'actGetOrders',
    ]),
    initApp() {
      this.getConfigData();
    },
    getConfigData() {
      this.actGetConfig().then((response) => {
        // Checking the type of response and parsing accordingly
        if (typeof(response) == 'string') {
          response = JSON.parse(response);
        }

        var altConfig = {
          environment: response.environment,
          currencies: response.currencies,
          messages: response.messages,
          subscriptionPage: response.subscriptionPage,
          discountPrices: response.discountPrices,
          kids: response.kids,
          menus: response.menu,
          pageLimit: response.pageLimit,
          passwordMaxLength: response.passwordMaxLength,
          passwordMinLength: response.passwordMinLength,
          welcomePage: response.welcomePage,
          payment_config: response.payment_config.payment_providers,
          baseUrl: response.environment.mmURL,
          geoApiUrl: response.environment.geolocationURL,
          facebookID: response.environment.facebookID,
          title: response.environment.title,
          freshdeskUrl: response.environment.freshDeskURL,
          freshDeskAPIKey: response.environment.freshDeskAPIKey,
        };

        this.setBaseUrl(altConfig.baseUrl);
        this.setAltMessages(altConfig.messages);
        this.setAltSubsPageMessages(altConfig.subscriptionPage);

        localStorage.setItem("paymentProxyURL", altConfig.environment.paymentProxyURL);
        var urlMain = window.location.href;
        var res = urlMain.split("#");
        localStorage.setItem("currentHostName", res[0]);
        var successFailUrlHost = res[0];
        var successFailUrlHostSF  = successFailUrlHost.substring(0, successFailUrlHost.length - 1);
        localStorage.setItem("currentHostNameSF", successFailUrlHostSF);

        localStorage.setItem('altConfig', JSON.stringify(altConfig));

        // Get the Domain Data
        this.getDomain();

        // NOTE: TO BE REVERTED BACK
        // // Setting the device ID
        // var altDeviceId = localStorage.getItem('altDeviceId');
        // if (!(altDeviceId)) {
        //   localStorage.setItem('altDeviceId', this.generateRandomId(32));
        // }
        //
        // // To prompt the user to enable the protected content playback once he enter the playerscreen for the first time
        // if (!(localStorage.getItem('promptPcPlayback'))) {
        //   localStorage.setItem('promptPcPlayback', JSON.stringify({ value: true }));
        // }
        //
        // // Register the device name
        // var altDeviceName = undefined;
        // if (localStorage.getItem('altDeviceName')) {
        //   altDeviceName = localStorage.getItem('altDeviceName');
        // } else {
        //   var platform = this.altDetectPlatform();
        //
        //   // console.log('[actions | actRegisterDevice | platform | ]', platform);
        //
        //   if (platform) {
        //     altDeviceName = platform.os + ' ' + platform.osVersion + ' ' + platform.browser + ' ' + platform.browserVersion;
        //   }
        //   // Set the device name to localStorage
        //   localStorage.setItem('altDeviceName', altDeviceName);
        // }
      }, (error) => {
        console.log('[App -> getConfigData -> error ]', error);
      });
    },
    getDomain() {
      this.actGetDomain().then((response) => {
        // console.log('[App -> getDomain -> response ]', response);

        localStorage.setItem('altGeoData', JSON.stringify(response));

        var homeDomain = 'IN';
        var visitedDomain = 'IN';

        if (response.country && response.country.iso_code && response.country.iso_code != 'IN') {
          visitedDomain = 'row';
        }

        if(!localStorage.getItem('homeDomain')) {
          localStorage.setItem('homeDomain', homeDomain);
        }

        // Code change for Domain Switch
        // Comment and uncomment the two lines of code for domain switching
        // Code added by Sangeeth (02-01-2018)
        localStorage.setItem('visitedDomain', visitedDomain);
        // End of Code change for Domain Switch

        this.setAppActive(true);

        // NOTE: TO BE REVERTED BACK
        // // Initializing the Mobile Analytics, Notification
        // this.initAWSMA();
      }, (error) => {
        // console.log('[App -> getDomain -> error ]', error);
      });
    },

  }
}
</script>

<style>

</style>
