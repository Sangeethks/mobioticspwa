<template>
  <div id="alt-app">
    <router-view></router-view>
    <app-loader v-show="showAppLoader"></app-loader>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { eventBus } from '@/main';
import mxnUtilities from '@/mixins/utilities';
import AppLoader from '@/components/shared/AppLoader.vue';

export default {
  name: 'app',
  data () {
    return {
      // Determines the visibility of the main loader
      showAppLoader: true,
    };
  },
  created () {
    // Entry point of Apps execution
    this.initApp();
    // Event handler for main loader
    eventBus.$on('toggleAppLoaderEvent', state => { this.showAppLoader = state });
  },
  components: {
    // App Loader component registration
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

        // Get the Domain Data
        this.getDomain();

        localStorage.setItem("paymentProxyURL", altConfig.environment.paymentProxyURL);
        var urlMain = window.location.href;
        var res = urlMain.split("#");
        localStorage.setItem("currentHostName", res[0]);
        var successFailUrlHost = res[0];
        var successFailUrlHostSF  = successFailUrlHost.substring(0, successFailUrlHost.length - 1);
        localStorage.setItem("currentHostNameSF", successFailUrlHostSF);

        localStorage.setItem('altConfig', JSON.stringify(altConfig));

        // Setting the device ID
        var altDeviceId = localStorage.getItem('altDeviceId');
        if (!(altDeviceId)) {
          localStorage.setItem('altDeviceId', this.generateRandomId(32));
        }

        // To prompt the user to enable the protected content playback once he enter the playerscreen for the first time
        if (!(localStorage.getItem('promptPcPlayback'))) {
          localStorage.setItem('promptPcPlayback', JSON.stringify({ value: true }));
        }

        // Register the device name
        var altDeviceName = undefined;
        if (localStorage.getItem('altDeviceName')) {
          altDeviceName = localStorage.getItem('altDeviceName');
        } else {
          var platform = this.altDetectPlatform();

          if (platform) {
            altDeviceName = platform.os + ' ' + platform.osVersion + ' ' + platform.browser + ' ' + platform.browserVersion;
          }
          // Set the device name to localStorage
          localStorage.setItem('altDeviceName', altDeviceName);
        }
      }, (error) => {
        console.log('[App -> getConfigData -> error ]', error);
      });
    },
    getDomain() {
      this.actGetDomain().then((response) => {
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

        // Initializing the Mobile Analytics, Notification
        this.initAWSMA();
      }, (error) => {
        console.log('[App -> getDomain -> error ]', error);
      });
    },
    initAWSMA() {
      import(/* webpackChunkName: 'AWSMA' */ 'aws-sdk-mobile-analytics').then((AWSMA) => {

        // Get the config data
        var altConfig = undefined;
        if (localStorage.getItem('altConfig')) {
          altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        // If Config data not present exit out of method
        if (!altConfig) return;

        // AWS Configuration
        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:25fbde9b-f19b-45e3-8e12-ffa78d3c65a8'
        });

        // Gets the platform information [mixins.js]
        var userAgentDetails = this.altDetectPlatform();

        // Setting the AWSMA Configuration
        var options = {
          appId: altConfig.environment.awsMobileAnalyticsAppID,
          appTitle : 'ALTBalaji',
          appVersionName : 'V' + this.appVersionName,
          appVersionCode : this.appVersionCode,
          autoSubmitInterval: 20000,
          platform: 'PWA',
          sessionLength: 1800000,
          make: userAgentDetails.browser,
          globalAttributes: {
            br_name : userAgentDetails.browser +"-"+ userAgentDetails.browserVersion,
            br_family:userAgentDetails.browser,
            br_version : userAgentDetails.browserVersion,
            br_type : userAgentDetails.browser,
            user_id: null, //review
            user_email: null, //review
            user_session: null, //review
            utm_source: this.$route.query.utm_source ? this.$route.query.utm_source :null,
          },
        };
        window.mobileAnalyticsClient = new AMA.Manager(options);
      }).catch((error) => {
        console.log('[App -> initAWSMA -> error ]', error);
      });
    },
  }, // methods
  mixins: [ mxnUtilities ]
}
</script>

<style>

</style>
