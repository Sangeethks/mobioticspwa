import Vue from 'vue'

const state = {
    /**
     * for template related
     */
    templateActive: false,

    menuId: undefined,

    homeSectionId: undefined,
    homeSections: undefined,

    homeContents: new Array(),
    firstContent: new Array(),
    gridContents: undefined,
    totalElements: undefined,
    totalPages: undefined,
    homeUrlQuery: undefined,
    offset: 0,
    limit: 7,
    page: 1,
    kidsSectionNavs: undefined,
    kidsContents: undefined,
    homeActiveSectionTitle: undefined,
    kidsActiveSectionTitle: undefined,
    /**
     * favourites
     */
    favouriteDeleteMode: undefined,
    /**
     * recently watched
     */
    recentDeleteMode: undefined,
    showLoadMore: true,
    pageCount: 0,
    menuTitle: undefined,
    showWatching: false,
    searchFilterResults: undefined,
    altMessages: undefined,
    altSubsPageMessages: undefined,
    pageTitle: undefined
};

const getters = {
    templateActive: (state) => {
        return state.templateActive
    },
    menuId: (state) => {
        return state.menuId;
    },
    homeSections: (state) => {
        return state.homeSections;
    },
    homeContents: (state) => {
        return state.homeContents;
    },
    firstContent: (state) => {
        return state.firstContent;
    },
    gridContents: (state) => {
        return state.gridContents;
    },
    homeUrlQuery: (state) => {
        return state.homeUrlQuery;
    },
    offset: (state) => {
        return state.offset;
    },
    limit: (state) => {
        return state.limit;
    },
    page: (state) => {
        return state.page;
    },
    totalElements: (state) => {
        return state.totalElements;
    },
    totalPages: (state) => {
        return state.totalPages;
    },
    kidsSectionNavs: (state) => {
        return state.kidsSectionNavs;
    },
    kidsContents: (state) => {
        return state.kidsContents;
    },
    homeActiveSectionTitle: (state) => {
        return state.homeActiveSectionTitle;
    },
    kidsActiveSectionTitle: (state) => {
        return state.kidsActiveSectionTitle;
    },
    favouriteDeleteMode: (state) => {
        return state.favouriteDeleteMode;
    },
    recentDeleteMode: (state) => {
        return state.recentDeleteMode;
    },
    showLoadMore: (state) => {
        return state.showLoadMore;
    },
    pageCount: (state) => {
        return state.pageCount;
    },
    menuTitle: (state) => {
        return state.menuTitle;
    },
    showWatching: (state) => {
        return state.showWatching;
    },
    searchFilterResults: (state) => {
        return state.searchFilterResults;
    },
    altMessages: (state) => {
        return state.altMessages;
    },
    altSubsPageMessages: (state) => {
        return state.altSubsPageMessages;
    },
    /**
     * (Added) Sangeeth (08-12-17)
     * Getting title for the home page sections
     */
    pageTitle: (state) => {
        return state.pageTitle;
    },
};

const mutations = {
    /**
     * (Added) Sangeeth (08-12-17)
     * Setting page title for home page sections
     */
    setPageTitle: (state, title) => {
        state.pageTitle = title;
    },
    setTemplateActive: (state, status) => {
        state.templateActive = status;
    },
    setMenuId: (state, id) => {
        state.menuId = id;
    },
    setHomeSections: (state, sections) => {
        state.homeSections = sections;
    },
    setHomeContents: (state, contents) => {
        state.homeContents = contents;
    },
    setFirstContent: (state, content) => {
        state.firstContent = content;
    },
    setGridContents: (state, contents) => {
        state.gridContents = contents;
    },
    setTotalElements: (state, count) => {
        state.totalElements = count;
    },
    setTotalPages: (state, count) => {
        state.totalPages = count;
    },
    setHomeUrlQuery: (state, query) => {
        state.homeUrlQuery = query;
    },
    setOffset: (state, offset) => {
        state.offset = offset;
    },
    setLimit: (state, limit) => {
        state.limit = limit;
    },
    setPage: (state, page) => {
        state.page = page;
    },
    setAddToHomeContents: (state, contents) => {

        var homeContents = state.homeContents;

        Array.prototype.push.apply(state.homeContents, contents);

        state.homeContents = homeContents;

    },
    setKidsSectionNavs: (state, sections) => {
        state.kidsSectionNavs = sections;
    },
    setKidsContents: (state, contents) => {
        state.kidsContents = contents;
    },
    setHomeActiveSectionTitle: (state, title) => {
        state.homeActiveSectionTitle = title;
    },
    setKidsActiveSectionTitle: (state, title) => {
        state.kidsActiveSectionTitle = title;
    },
    /**
     * favourites
     */
    setFavouriteDeleteMode: (state, status) => {
        state.favouriteDeleteMode = status;
    },
    /**
     * recently watched
     */
    setRecentDeleteMode: (state, status) => {
        state.recentDeleteMode = status;
    },
    /**
     * show load more
     */
    setShowLoadMore: (state, status) => {
        state.showLoadMore = status;
    },
    setPageCount: (state, count) => {
        state.pageCount = count;
    },
    setMenuTitle: (state, title) => {
        state.menuTitle = title;
    },
    setShowWatching: (state, status) => {
        state.showWatching = status;
    },
    setSearchFilterResults: (state, results) => {
        state.searchFilterResults = results;
    },
    setAltMessages: (state, messages) => {
        state.altMessages = messages;
    },
    setAltSubsPageMessages: (state, messages) => {
        state.altSubsPageMessages = messages;
    },
};

const actions = {
    /**
    * Getting the Sections List
    */
    actGetSections: (context, id) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');

        var requestObj = {
            params: {
                domain: domain,
            }
        };
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
            requestObj.headers = {
                XSSESSION: altUser.sessionToken
            }
        }
        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/sections/' + id, requestObj).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body.lists);
                    } else {
                        reject('[actGetSections response] Error');
                    }
                },
                (err) => {
                    reject('[actGetSections err] Error');
                }
            )
        })
    },
    /**
    * Getting home contents by url
    */
    actGetContentsByUrl: (context, urlObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');

        // console.log('[actGetContentsByUrl | urlObj ]', urlObj);

        // var requestObj = {
        //     params: {
        //         domain: domain,
        //         page: obj.page,
        //         size: obj.size,
        //         timestamp: Math.floor(new Date() / 1000)
        //     }
        // }

        var requestObj = urlObj.requestObj;

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
            requestObj.headers = {
                XSSESSION: altUser.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + urlObj.url, urlObj.requestObj).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({error: true, message: 'actGetContentsByUrl response error'})
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    /**
    * Getting home contents by url
    */
    actGetContentsById: (context, obj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/sections/lists/' + obj.id, {
                params: {
                    domain: domain,
                    limit: obj.limit,
                    offset: obj.offset,
                }
            }).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    } else {
                        reject('[Home Action actGetContentsByUrl] Error')
                    }
                },
                (err) => {
                    reject('[Home Action actGetContentsByUrl] Error')
                }
            )
        })
    },
    /**
     * delete recently watched item
     */
    actGetKidsContentsByUrl: (context, obj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');

        var requestObj = {
            params: {
                domain: domain,
                limit: obj.limit,
                offset: obj.offset,
            }
        }

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        return new Promise((resolve, reject) => {
            if (!(altUser)) {
                reject({error: true, message: 'user data not available'});
            }

            Vue.http.get(baseUrl + obj.url, {
                params: {
                    domain,
                    limit: obj.limit,
                    offset: obj.offset,
                    timestamp: Math.floor(new Date() / 1000)
                },
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then((response) => {
                if (response.ok && response.status == 200) {
                    resolve(response.body);
                } else {
                    reject({error: true, message: 'actGetKidsContentsByUrl response error'})
                }
            }, (error) => {
                reject(error.body);
            });
        })
    },
    actDeleteRecentItem: (context, contentId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Delete recent item, user data missing' });
            }
            Vue.http.delete(baseUrl + '/accounts/profiles/recently-watched/' + contentId, {
                params: {
                    domain: domain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Delete recent item failed' })
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Delete recent item failed' });
                }
            )
        })
    },
    /**
     * delete all recently watched items
     */
    actDeleteRecentItems: (context, contentId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Delete recent items, user data missing' });
            }
            Vue.http.delete(baseUrl + '/accounts/profiles/recently-watched', {
                params: {
                    domain: domain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    // console.log(response);
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Delete recent item, user data missing' })
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Delete recent item, user data missing' });
                }
            )
        })
    },
    /**
     * delete favourite media
     */
    actDeleteFavouriteMedia: (context, contentId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Delete favourite failed' });
            }
            Vue.http.delete(baseUrl + '/accounts/profiles/favourites/media/' + contentId, {
                params: {
                    domain: domain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Delete favourite failed' })
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Delete favourite failed' });
                }
            )
        })
    },
    /**
     * delete all favourite items
     */
    actDeleteFavouriteItems: (context) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Delete favourite failed' });
            }
            Vue.http.delete(baseUrl + '/accounts/profiles/favourites', {
                params: {
                    domain: domain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Delete favourite failed' })
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Delete favourite failed' });
                }
            )
        })
    },
    /**
     * delete favourite series
     */
    actDeleteFavouriteSeries: (context, seriesId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Delete favourite failed' });
            }
            Vue.http.delete(baseUrl + '/accounts/profiles/favourites/series/' + seriesId, {
                params: {
                    domain: domain,
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Delete favourite failed' })
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Delete favourite failed' });
                }
            )
        });
    },
    /**
     * Check in favourite series
     */
    actCheckinFavouriteSeries: (context, seriesId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ error: true, message: 'missing user data' });
            }
            Vue.http.post(baseUrl + '/accounts/profiles/favourites/series/' + seriesId + '?domain=' + domain, '', {
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[home.js | actCheckinFavouriteSeries | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'actDeleteRecentItem response error' })
                    }
                },
                (error) => {
                    // console.log('[home.js | actCheckinFavouriteSeries | error | ]', error);
                    reject(error.body);
                }
            )
        });
    },
    /**
     * Check in favourite series
     */
    actCheckinFavouriteMedia: (context, contentId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ error: true, message: 'missing user data' });
            }
            Vue.http.post(baseUrl + '/accounts/profiles/favourites/media/' + contentId + '?domain=' + domain, { domain: domain }, {
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[home.js | actCheckinFavouriteSeries | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'actDeleteRecentItem response error' })
                    }
                },
                (error) => {
                    // console.log('[home.js | actCheckinFavouriteSeries | error | ]', error);
                    reject(error.body);
                }
            )
        });
    },
    /**
     * Add to favourite series
     */
    actAddtoFavouriteSeries: (context, seriesId) => {
        // console.log('[home.js | actAddtoFavouriteSeries | seriesId | ]', seriesId);
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Add favourite failed' });
            }
            Vue.http.post(baseUrl + '/accounts/profiles/favourites?domain=' + domain, { series_id: seriesId }, {
                headers: {
                    XSSESSION: user.sessionToken
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
            );
        });
    },
    /**
     * Add to favourite media
     */
    actAddtoFavouriteMedia: (context, contentId) => {
        // console.log('[home.js | actAddtoFavouriteMedia | contentId | ]', contentId);
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ code: 0, message: 'Add favourite failed' });
            }
            Vue.http.post(baseUrl + '/accounts/profiles/favourites?domain=' + domain, { media_id: contentId }, {
                headers: {
                    XSSESSION: user.sessionToken
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
        });
    },
    /**
     * get recently watched items
     */
    actGetRecentlyWatched: (context, reqObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('homeDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        return new Promise((resolve, reject) => {
            if (!(user)) {
                reject({ error: true, message: 'missing user data' });
            }
            Vue.http.get(baseUrl + '/accounts/profiles/recently-watched/', {
                params: {
                    domain: domain,
                    offset: reqObj.offset,
                    limit: reqObj.limit,
                    timestamp: Math.floor((new Date() / 100))
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'actAddtoFavouriteMedia response error' })
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        })
    },

};

export default {
    state, getters, mutations, actions
};
