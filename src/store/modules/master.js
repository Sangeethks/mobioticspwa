import Vue from 'vue';

export default {
  state: {
    configUrl: 'https://static.cloud.altbalaji.com/config/v18/prod-config.json',
    appVersionName: '1.4',
    appVersionCode: '25',
    baseUrl: undefined,
    freshdeskUrl: undefined,
    domain: undefined,
    appActive: undefined,
    navMenus: undefined,
    sectionMenus: undefined,
    otherMenus: undefined,
    homeSectionId: undefined,
    kidsSectionId: undefined,
    user: undefined,
    userLoggedIn: false,
    userActive: false,
    account: undefined,
    device: undefined,
    order: undefined,
    deviceId: undefined,
    altMessage: undefined,
    routerToParam: undefined,
    routerFromParam: undefined,
    discountData: undefined,
    signupRedirectData: undefined,

  },
  getters: {
    baseUrl: (state) => {
      return (state.baseUrl).replace(/\/$/, "");
    },
    freshdeskUrl: (state) => {
      return (state.freshdeskUrl).replace(/\/$/, "");
    },
    domain: (state) => {
      return state.domain;
    },
    appVersionName: (state) => {
      return state.appVersionName;
    },
    apVersionCode: (state) => {
      return state.appVersionCode;
    },
    deviceId: (state) => {
      return localStorage.getItem('altDeviceId');
    },
    appActive: (state) => {
      return state.appActive;
    },
    user: (state) => {
      return state.user;
    },
    account: (state) => {
      return state.account;
    },
    navMenus: (state) => {
      return state.navMenus;
    },
    userLoggedIn: (state) => {
      return state.userLoggedIn;
    },
    sectionMenus: (state) => {
      return state.sectionMenus;
    },
    otherMenus: (state) => {
      return state.otherMenus;
    },
    homeSectionId: (state) => {
      return state.homeSectionId;
    },
    kidsSectionId: (state) => {
      return state.kidsSectionId;
    },
    altMessage: (state) => {
      return state.altMessage;
    },
    routerToParam: (state) => {
      return state.routerToParam;
    },
    routerFromParam: (state) => {
      return state.routerFromParam;
    },

    discountData: (state) => {
      return state.discountData;
    },
    paymentPayuUrl: (state) => {
      return state.paymentPayuUrl;
    },
    signupRedirectData: (state) => {
      return state.signupRedirectData;
    },
  },
  mutations: {
    setNavMenus: (state, menu) => {
      state.navMenus = menu;
    },
    setBaseUrl: (state, url) => {
      state.baseUrl = url;
    },
    setFreshdeskUrl: (state, url) => {
      state.freshdeskUrl = url;
    },
    setDomain: (state, domain) => {
      state.domain = domain;
    },
    setSectionMenus: (state, menus) => {
      state.sectionMenus = menus;
    },
    setOtherMenus: (state, menus) => {
      state.otherMenus = menus;
    },
    setHomeSectionId: (state, id) => {
      state.homeSectionId = id;
    },
    setKidsSectionId: (state, id) => {
      state.kidsSectionId = id;
    },
    setAppActive: (state, value) => {
      state.appActive = value;
    },
    setUser: (state, user) => {
      state.user = user;
    },
    setUserLoggedIn: (state, status) => {
      state.userLoggedIn = status;
    },
    setAccount: (state, account) => {
      state.account = account;
    },
    setDevice: (state, device) => {
      state.device = device;
    },
    setOrder: (state, order) => {
      state.order = order;
    },
    setAltMessages: (state, messages) => {
      state.altMessages = messages;
    },
    setRouterToParam: (state, param) => {
      state.routerToParam = param;
    },
    setRouterFromParam: (state, param) => {
      state.routerFromParam = param;
    },
    setDiscountData: (state, data) => {
      state.discountData = data;
    },
    setPaymentPayuUrl: (state, payuUrl) => {
      state.paymentPayuUrl = payuUrl;
    },
    setSignupRedirectData: (state, signupRedirectDataParameter) => {
      state.signupRedirectData = signupRedirectDataParameter;
    },
    setAltSubsPageMessages: (state, messages) => {
      state.altSubsPageMessages = messages;
    },
  },
  actions: {
    actGetConfig: (context, payload) => {
      return new Promise( (resolve, reject) => {
        Vue.http.get(context.state.configUrl).then((response) => {
          if (response.ok && response.status == 200) {
            var resObj = response.body;
            resolve(resObj);
          } else {
            reject(response.statusText);
          }
        }, (error) => {
          reject('[actGetConfig] Error');
        });
      });
    },
    actGetDomain: (context) => {
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }

      return new Promise( (resolve, reject) => {
        if (!altConfig) reject({ error: true, message: 'missing config data' });

        Vue.http.get(altConfig.geoApiUrl).then((response) => {
          // console.log('[actions | actGetDomain | response | ]', response);

          if (response.status == 200 && response.ok) {
            resolve(response.body);
          } else {
            reject({ error: true, message: 'Failed to get geo location data' });
          }
        }, (error) => {
          reject(error.body);
        });
      });
    },
    actGetUserSignup: (context, data) => {
      var baseUrl = context.getters.baseUrl;
      //NOTE 09.01.2018 added by sumit for row user
      var domain = localStorage.getItem('visitedDomain');

      return new Promise((resolve, reject) => {
        Vue.http.post(baseUrl + '/accounts?domain=' + domain, data).then((response) => {
          if (response.status == 201 && response.ok) {
            resolve(response.body)
          } else {
            reject({error: true, message: 'user signup response error'});
          }
        }, (error) => {
          reject(error.body);
        });
      });
    },
    actGetUpdateUser: (context, data) => {
      var baseUrl = context.getters.baseUrl;
      var domain = localStorage.getItem('homeDomain');
      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }

      return new Promise((resolve, reject) => {
        if (!(altUser) || !(altUser.sessionToken)) {
          reject({ error: true, message: 'user data not available' });
        }
        Vue.http.put(baseUrl + '/accounts?domain=' + domain, data, {
          headers: {
            XSSESSION: altUser.sessionToken
          }
        }).then(
          (response) => {
            if (response.ok && response.status == 200) {
              resolve(response.body)
            } else {
              reject({ code: response.status, message: 'user profile update error' });
            }
          },
          (error) => {
            reject(error.body);
          }
        );
      });
    },
    actGetUserLogin: (context, data) => {
      var baseUrl = context.getters.baseUrl;
      var domain = localStorage.getItem('homeDomain');

      return new Promise((resolve, reject) => {
        if (!(domain)) {
          reject({ error: true, message: 'missing domain data' });
        }
        Vue.http.post(baseUrl + '/accounts/login?domain=' + domain, {
          username: data.username,
          password: data.password
        }).then(
          (response) => {
            if (response.status == 200 && response.ok) {
              resolve(response.body)
            } else {
              reject({ error: true, message: 'user login response error' });
            }
          },
          (error) => {
            reject(error.body);
          }
        )
      })
    },
    actGetAccountDetails: (context, user) => {
      var baseUrl = context.getters.baseUrl;
      var domain = localStorage.getItem('homeDomain');

      return new Promise((resolve, reject) => {
        if (user) {
          var sessionToken = user.sessionToken;
        } else {
          reject({ error: true, message: 'user object not available' })
        }

        Vue.http.get(baseUrl + '/accounts', {
          params: {
            domain: domain,
            timestamp: Math.floor((new Date() / 1000))
          },
          headers: {
            XSSESSION: sessionToken
          }
        }).then(
          (response) => {
            if (response.status == 200) {
              resolve(response.body);
            }
          },
          (error) => {
            reject({ error: true, error });
          }
        )
      })
    },
    actGetDeviceList: (context, user) => {
      var baseUrl = context.getters.baseUrl;

      return new Promise((resolve, reject) => {
        if (user) {
          var sessionToken = user.sessionToken;
        } else {
          reject({ error: true, message: 'user object not available' })
        }

        Vue.http.get(baseUrl + '/accounts/devices', {
          params: {
            timestamp: Math.floor((new Date() / 100))
          },
          headers: {
            XSSESSION: sessionToken,
          }
        }).then(
          (response) => {
            if (response.ok && response.status != 404) {
              resolve(response.body);
            } else {
              reject({ error: true, message: 'error in getting device list' });
            }
          },
          (error) => {
            reject({ error: true, message: 'error in getting device list' });
          }
        )
      })
    },
    actRegisterDevice: (context, registerObj) => {
      var baseUrl = context.getters.baseUrl;
      var user = registerObj.user;
      var deviceId = registerObj.deviceId;

      return new Promise((resolve, reject) => {
        if (user) {
          var sessionToken = user.sessionToken;
        } else {
          reject({ error: true, message: 'user object not available' })
        }
        if (!(deviceId)) {
          reject({ error: true, message: 'Device ID not available' })
        }

        var altDeviceName = localStorage.getItem('altDeviceName');

        Vue.http.post(baseUrl + '/accounts/devices', {
          uuid: deviceId,
          name: altDeviceName
        }, {
          headers: {
            XSSESSION: sessionToken
          }
        }).then(
          (response) => {
            if (response.ok && response.status != 404) {
              resolve(response.body);
            }
          },
          (error) => {
            reject(error.body);
          }
        )
      })
    },
    actDeleteDevice: (context, deleteObj) => {
      var baseUrl = context.getters.baseUrl;
      var user = deleteObj.user;
      var deviceId = deleteObj.deviceId;

      // console.log('[actions | actDeleteDevice | user | ]', user);
      // console.log('[actions | actDeleteDevice | deviceId | ]', deviceId);
      return new Promise((resolve, reject) => {
        if (user) {
          var sessionToken = user.sessionToken;
        } else {
          reject({ error: true, message: 'user object not available' })
        }
        if (!(deviceId)) {
          reject({ error: true, message: 'deviceId empty' })
        }

        Vue.http.delete(baseUrl + '/accounts/devices/' + deviceId, {
          headers: {
            XSSESSION: sessionToken
          }
        }).then(
          (response) => {
            if (response.ok && response.status == 200) {
              resolve(response.body);
            } else {
              reject({ error: true, message: 'error in getting device list' });
            }
          },
          (error) => {
            reject(error.body);
          }
        )
      })
    },
    actGetOrders: (context, user) => {
      var baseUrl = context.getters.baseUrl;
      // var domain = context.getters.domain;
      var domain = localStorage.getItem('homeDomain');

      return new Promise((resolve, reject) => {
        if (user) {
          var sessionToken = user.sessionToken;
        } else {
          reject({ error: 'actGetOrders: user not available' })
        }
        //NOTE change by sumit,some time not taking baseUrl,so i added. 11/12/2017
        Vue.http.get("https://api.cloud.altbalaji.com" + '/accounts/orders', {
          params: {
            order_status: 'ok',
            domain: domain,
            sessionToken: sessionToken,
            timestamp: Math.floor(new Date() / 1000)
          },
          headers: {
            XSSESSION: sessionToken
          }
        }).then(
          (response) => {
            if (response.ok && response.status == 200) {
              resolve(response.body);
            } else {
              reject(response.body);
            }
          },
          (error) => {
            reject(error.body);
          }
        )
      })
    },
  } // actions
} // export
