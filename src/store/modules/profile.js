import Vue from 'vue';
import altMixins from '../../mixins';

const state = {
    editProfileMode: undefined,
    altKidsProfile: undefined,
    altKidsUser: undefined,
    passphrase: 'yGfLJhaFsQFuKCq418Yu',
    tocData: undefined,
    privacyData: undefined,
    favourites: undefined,
    recentlyWatched: undefined,
    deleteError: 0,
    hideBin:undefined,
};

const getters = {
    editProfileMode: (state) => {
        return state.editProfileMode;
    },
    altKidsProfile: (state) => {
        return state.altKidsProfile;
    },
    altKidsUser: (state) => {
        return state.altKidsUser;
    },
    passphrase: (state) => {
        return state.passphrase;
    },
    tocData: (state) => {
        return state.tocData;
    },
    privacyData: (state) => {
        return state.privacyData;
    },
    favourites: (state) => {
        return state.favourites;
    },
    hideBin: (state) => {
        return state.hideBin;
    },
    recentlyWatched: (state) => {
        return state.recentlyWatched;
    },
    deleteError: (state) => {
        return state.deleteError;
    },
};

const mutations = {
    setEditProfileMode: (state, change) => {
        state.editProfileMode = change;
    },
    setAltKidsProfile: (state, profile) => {
        state.altKidsProfile = profile;
    },
    setAltKidsUser: (state, user) => {
        state.altKidsUser = user;
    },
    setTocData: (state, data) => {
        state.tocData = data;
    },
    setPrivacyData: (state, data) => {
        state.privacyData = data;
    },
    setFavourites: (state, data) => {
        state.favourites = data;
    },
    setHideBin: (state, data) => {
        state.hideBin = data;
    },
    // added by sumit for noti 13.12
    setRecentlyWatched: (state, data) => {
        state.recentlyWatched = data;
    },
    setDeleteError: (state, count) => {
        state.deleteError = count;
    }
};

const actions = {
    actGetRecentWatched: (context, queryObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            /**
            * if userdata not present
            */
            if (!(user) && !(user.sessionToken)) {
                reject({ error: true, message: 'User data not available' });
            }
            Vue.http.get(baseUrl + '/accounts/profiles/recently-watched', {
                params: {
                    limit: queryObj.limit,
                    offset: queryObj.offset,
                    domain: domain,
                    stampid: altMixins.methods.generateRandomId(32),
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'Getting recently watched error' });
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        })  //  Promise
    },  //  actGetRecentWatched
    actGetFavouriteList: (context, reqObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ error: true, message: 'User data not available' })
            }
            Vue.http.get(baseUrl + '/accounts/profiles/favourites', {
                params: {
                    limit: reqObj.limit,
                    offset: reqObj.offset,
                    domain: domain,
                    stampid: altMixins.methods.generateRandomId(32),
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'actGetFavouriteList response rror' });
                    }
                },
                (error) => {
                    // console.log({ error: true, message: 'actGetFavouriteList error' });
                }
            )
        })

    },
    actCheckWithAccount: (context, user) => {
        // console.log('[Profile.js | actCheckWithAccount | user | ]', user);

        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        return new Promise((resolve, reject) => {
            // If user data is not availble reject the request
            if (!(altUser)) reject({ error: true, messaage: 'user data not available' });

            Vue.http.get(baseUrl + '/accounts/profiles', {
                params: {
                    domain: domain,
                    with_account: true,
                    timestamp: Math.floor(new Date() / 1000)
                },
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then((response) => {
                // console.log('[profile.js | actCheckWithAccount | response | ]', response);

                if (response.ok && response.status == 200) {
                    // console.log('[coming to 200]');
                    resolve(response.body);
                } else {
                    // console.log('[coming to reject]');
                    reject(response.body);
                }
            }, (error) => {
                // console.log('[profile.js | actCheckWithAccount | error | ]', error);

                reject(error.body);
            });
        });
    },
    actGetProfileSwitch: (context, profile) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // console.log('[profile.js | actGetProfileSwitch | altUser | ]', altUser);
        // console.log('[profile.js | actGetProfileSwitch | profile | ]', profile);

        return new Promise((resolve, reject) => {
            if (!(altUser)) reject({ error: true, message: 'user data not available' });

            Vue.http.put(
                baseUrl + '/accounts/profiles/switch', {
                    profile_id: profile.id,
                    pin: profile.pin,
                }, {
                    headers: {
                        XSSESSION: altUser.sessionToken
                    }
                }
            ).then((response) => {
                // console.log('[profile.js | actGetProfileSwitch | response | ]', response);

                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject(response.body);
                }
            }, (error) => {
                // console.log('[profile.js | actGetProfileSwitch | error | ]', error);
                reject(error.body);
            });
        })
    },
    actGetKidsProfileSwitch: (context, pin) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var profileId = context.getters.altKidsProfile.id;

        var altKidsUser = JSON.parse(localStorage.getItem('altKidsUser'));

        return new Promise((resolve, reject) => {
            if (!(altKidsUser)) {
                reject({ error: true, message: 'Kids profile data not available' })
            }
            Vue.http.put(
                baseUrl + '/accounts/profiles/switch', {
                    profile_id: profileId,
                    pin: pin
                }, {
                    headers: {
                        XSSESSION: altKidsUser.sessionToken
                    }
                }
            ).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'actGetProfileSwitch response rror' });
                    }
                },
                (error) => {
                    reject(error.body)
                }
            )
        });
    },
    actGetVerifyEmail: (context) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(altUser)) {
                reject({ error: true, message: 'missing user data' })
            }
            Vue.http.post(baseUrl + '/accounts/email/token?domain=' + domain, {
                token_type: 'registration',
                login: altUser.login,
                uri: 'https://altbalaji.com/activate/'
            }).then(
                (response) => {
                    resolve(response.body)
                },
                (error) => {
                    reject(error.body)
                }
            )
        })

    },
    actEditCurrentProfile: (context, profileData) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(altUser)) {
                reject({ error: true, message: 'missing user data' })
            }
            Vue.http.put(baseUrl + '/accounts/profiles', profileData, {
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    }
                    // resolve(response.body)
                },
                (error) => {
                    reject(error.body)
                }
            )
        })
    },
    actCreateNewProfile: (context, profileData) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(altUser)) {
                reject({ error: true, message: 'missing user data' })
            }
            Vue.http.post(baseUrl + '/accounts/profiles?with_account=true&domain=' + domain, profileData, {
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[profile.js | actCreateNewProfile | response | ]', response);
                    if (response.ok) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log('[profile.js | actCreateNewProfile | error | ]', error);
                    reject(error.body)
                }
            )
        })
    },
    actGetTocData: (context) => {
        return new Promise((resolve, reject) => {
            Vue.http.get('https://static.cloud.altbalaji.com/templates/TermsofUse.html').then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'error getting terms of use data' });
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        })
    },
    actGetPrivacyData: (context) => {
        return new Promise((resolve, reject) => {
            Vue.http.get('https://static.cloud.altbalaji.com/privacy-policy.html').then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'error getting terms of use data' });
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        })
    },
    actEditAccount: (context, data) => {
        // console.log('[profile | actEditAccount ]');

        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var altUser = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(altUser)) {
                reject({ error: true, message: 'missing user data' })
            }
            Vue.http.put(baseUrl + '/accounts/', data, {
                params: {
                    domain: domain,
                },
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[profile.js | actEditAccount | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log('[profile.js | actEditAccount | error | ]', error);

                    reject(error.body)
                }
            )
        })
    },
    actSendEmailWithToken: (context, emailData) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            Vue.http.post(baseUrl + '/accounts/email/token', emailData, {
                params: {
                    domain: domain,
                }
            }).then(
                (response) => {
                    // console.log('[profile.js | actEditAccount | response | ]', response);

                    if (response.ok && response.status == 201) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log('[profile.js | actEditAccount | error | ]', error);

                    reject(error.body)
                }
            )
        })
    },
    actFacebookLogin: (context, loginData) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        // console.log('profile.js | actGetProfileSwitch | profile | ', profile);

        return new Promise((resolve, reject) => {
            Vue.http.post(baseUrl + '/accounts/facebook/login', loginData, {
                params: {
                    domain: domain
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'actGetProfileSwitch response rror' });
                    }
                },
                (error) => {
                    reject(error.body)
                }
            )
        })
    },
    /**
    * Account Lookup
    */
    actAccountLookup: (context, user) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/accounts/lookup', {
                params: {
                    login: user.login,
                    domain: domain
                }
            }).then(
                (response) => {
                    // console.log('[Actions.js | actAccountLookup | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'error getting account lookup response' })
                    }
                },
                (err) => {
                    // console.log('[Actions.js | actAccountLookup | error | ]', error);

                    reject({ error: true, message: 'error getting account lookup' })
                }
            )
        })
    },
    actKidsMediaAccess: (context, mediaId) => {
        var baseUrl = context.getters.baseUrl;
        var altKidsUser = JSON.parse(localStorage.getItem('altKidsUser'));

        return new Promise((resolve, reject) => {
            if (!altKidsUser) {
                reject({ error: true, message: 'Userdata not available' });
            }
            Vue.http.post(baseUrl + '/accounts/media/' + mediaId + '/access', '', {
                headers: {
                    XSSESSION: altKidsUser.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'Getting media access Error' });
                    }
                },
                (error) => {
                    // console.log('[profile.js | actKidsMediaAccess | error | ]', error);

                    reject({ error: true, message: 'error getting media access' });
                }
            )
        });
    },
    actGetKidsMediaVideo: (context, mediaId) => {
        var baseUrl = context.getters.baseUrl;
        var altKidsUser = JSON.parse(localStorage.getItem('altKidsUser'));

        return new Promise((resolve, reject) => {
            if (!(altKidsUser)) {
                reject({ error: true, message: 'userdata not available' });
            }
            Vue.http.get(baseUrl + '/media/videos/' + mediaId, {
                headers: {
                    XSSESSION: altKidsUser.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[profile | actGetKidsMediaVideo | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject('[actGetKidsMediaVideo response error ]');
                    }
                },
                (error) => {
                    // console.log(error);

                    reject('[actGetKidsMediaVideo error ]');
                }
            )
        });
    },

};

export default {
    state, getters, mutations, actions
};
