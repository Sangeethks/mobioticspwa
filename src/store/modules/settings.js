import Vue from 'vue'

const state = {
    userProfile: undefined,
    accountOrders: undefined,
    tvodProduct: undefined,
    accessToKidsMode: false,
};

const getters = {
    userProfile: (state) => {
        return state.userProfile;
    },
    accountOrders: (state) => {
        return state.accountOrders;
    },
    tvodProduct: (state) => {
        return state.tvodProduct;
    },
    accessToKidsMode: (state) => {
        return state.accessToKidsMode;
    },
};

const mutations = {
    setUserProfile: (state, data) => {
        state.userProfile = data;
    },
    setAccountOrders: (state, orders) => {
        state.accountOrders = orders;
    },
    setTvodProduct: (state, product) => {
        state.tvodProduct = product;
    },
    setAccessToKidsMode: (state, access) => {
        state.accessToKidsMode = access;
    },
};

const actions = {
    actGetAccountInfo: (context) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/accounts', {
                params: {
                    domain: domain,
                    sessionToken: user.sessionToken,
                    timestamp: Math.floor(new Date() / 1000)
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[settings | actGetAccountInfo | response | ]', response);

                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    // console.log('[settings | actGetAccountInfo | error | ]', error);

                    reject(error.body);
                }
            )
        });
    },  //  actGetAccountInfo
    actGetUserLoggedOut: (context) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            /**
             * if user data not available
             */
            if (!(altUser)) {
                reject({ error: 'cannot find user data' });
            }

            Vue.http.post(baseUrl + '/accounts/logout', {
                domain: domain,
            }, {
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'error sending logout data' })
                    }
                },
                (err) => {
                    reject({ code: err.status, message: 'error sending logout data' })
                }
            )
        });
    },
    actGetHotspotContents: (context, userType) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var hotspotUrl = baseUrl + '/content/hotspots';

        return new Promise((resolve, reject) => {
            Vue.http.get(hotspotUrl, {
                params: {
                    domain: domain,
                    type: 'promo-' + userType
                }
            }).then(
                (response) => {
                    // console.log('[settings.js | actGetHotspotContents | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject(response.body);
                    }
                },
                (error) => {
                    // console.log('[settings.js | actGetHotspotContents | error | ]', error);
                    reject(error);
                }
            )
        });
    },
    actGetProductList: (context) => {
        var paymentUrl = JSON.parse(localStorage.getItem('altConfig')).environment.paymentProxyURL;
        var domain = localStorage.getItem('homeDomain');
        // console.log('[settings.js | actGetProductList | paymentUrl | ]', JSON.parse(localStorage.getItem('altConfig')).environment.paymentProxyURL);

        return new Promise((resolve, reject) => {
            Vue.http.get(paymentUrl + 'products', {
                params: {
                    domain,
                }
            }).then(
                (response) => {
                    // console.log('[settings.js | actGetHotspotContents | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (error) => {
                    // console.log('[settings.js | actGetHotspotContents | error | ]', error);
                    reject(error);
                }
            );
        });
    },
    actPostWelcomeEmail: (context) => {
        var baseUrl = context.getters.baseUrl;
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        // console.log('[settings | actPostWelcomeEmail | altUser | ]', altUser);

        return new Promise((resolve, reject) => {
            if (!(altUser)) {
                reject({ error: true, message: 'user data' });
            }

            Vue.http.post(baseUrl + '/accounts/email', {
                login: altUser.login,
                template: 'welcome'
            }, {
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 201) {
                        resolve(response.body);
                    } else {
                        reject(response.body);
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    //NOTE added by sumit for update email and notification toggle
    actAccountEdit: (context,accountData) => {
        var baseUrl = context.getters.baseUrl;
        var altUser = JSON.parse(localStorage.getItem('altUser'));
        var homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
            homeDomain = localStorage.getItem('homeDomain');
        }
        return new Promise((resolve, reject) => {
            Vue.http.put(baseUrl + '/accounts',accountData,{
                params: {
                    domain: homeDomain,
                },
                headers: {
                    XSSESSION: altUser.sessionToken
                },
            }).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'invalid voucher code' });
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actCheckToken: (context, token) => {
        var baseUrl = context.getters.baseUrl;
        var homeDomain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            Vue.http.post(baseUrl + '/accounts/email/token/check', { token }, {
                params: {
                    domain: homeDomain
                }
            }).then((response) => {
                // console.log('[Help.js | actSendTicket | response | ]', response);

                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            }, (error) => {
                // console.log('[Help.js | actSendTicket | error | ]', error);

                reject(error.body);
            });
        });
    },
    actUpdatePassword: (context, reqPayload) => {
        var baseUrl = context.getters.baseUrl;
        var homeDomain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            Vue.http.post(baseUrl + '/accounts/password', reqPayload, {
                params: {
                    domain: homeDomain
                }
            }).then((response) => {
                // console.log('[Help.js | actSendTicket | response | ]', response);

                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            }, (error) => {
                // console.log('[Help.js | actSendTicket | error | ]', error);

                reject(error.body);
            });
        });
    },
    actVerifyEmail: (context, reqPayload) => {
        var baseUrl = context.getters.baseUrl;
        var homeDomain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            Vue.http.post(baseUrl + '/accounts/email/verify', reqPayload, {
                params: {
                    domain: homeDomain
                }
            }).then((response) => {
                // console.log('[Help.js | actSendTicket | response | ]', response);

                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            }, (error) => {
                // console.log('[Help.js | actSendTicket | error | ]', error);

                reject(error.body);
            });
        });
    },
};

export default {
    state, getters, mutations, actions
};
