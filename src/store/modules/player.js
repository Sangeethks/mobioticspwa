import Vue from 'vue'

const state = {
    playerContent: undefined,
    kidsPlayerContent: undefined,
    kidsDetailsContents: undefined,
    seasons: undefined,
    relatedEpisodes: undefined,
    videoPoster: undefined,
    kidsVideoPoster: undefined,
    seasonNumber: undefined,
    showMovieButton: undefined,
    currentLanguage: '',
    availLanguages: undefined,
};

const getters = {
    playerContent: (state) => {
        return state.playerContent;
    },
    kidsPlayerContent: (state) => {
        return state.kidsPlayerContent;
    },
    kidsDetailsContents: (state) => {
        return state.kidsDetailsContents;
    },
    seasons: (state) => {
        return state.seasons;
    },
    relatedEpisodes: (state) => {
        return state.relatedEpisodes;
    },
    videoPoster: (state) => {
        return state.videoPoster;
    },
    kidsVideoPoster: (state) => {
        return state.kidsVideoPoster;
    },
    seasonNumber: (state) => {
        return state.seasonNumber;
    },
    currentLanguage: (state) => {
        return state.currentLanguage;
    },
    availLanguages: (state) => {
        return state.availLanguages;
    },
};

const mutations = {
    setPlayerContent: (state, item) => {
        state.playerContent = item;
    },
    setKidsPlayerContent: (state, item) => {
        state.kidsPlayerContent = item;
    },
    setKidsDetailsContents: (state, contents) => {
        state.kidsDetailsContents = contents;
    },
    setSeasons: (state, seasons) => {
        state.seasons = seasons;
    },
    setRelatedEpisodes: (state, relatedEpisodes) => {
        state.relatedEpisodes = relatedEpisodes;
    },
    setVideoPoster: (state, poster) => {
        state.videoPoster = poster;
    },
    setKidsVideoPoster: (state, poster) => {
        state.kidsVideoPoster = poster;
    },
    setSeasonNumber: (state, number) => {
        state.seasonNumber = number;
    },
    setCurrentLanguage: (state, language) => {
        state.currentLanguage = language;
    },
    setAvailLanguages: (state, languages) => {
        state.availLanguages = languages;
    },
};

const actions = {
    actGetMediaVideo: (context, id) => {
        var baseUrl = context.getters.baseUrl;
        var user = JSON.parse(localStorage.getItem('altUser'));
        var domain = localStorage.getItem('visitedDomain');

        var urlParam = {
            params: {
                domain: domain,
                timestamp: Math.round(new Date() / 1000),
            }
        };
        if (user) {
            urlParam.headers = {
                XSSESSION: user.sessionToken
            }
        }

        // console.log('[player | actGetMediaVideo | urlParam | ]', urlParam);

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/media/videos/' + id, urlParam).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        // console.log(response);

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
    },  //  actGetMediaVideo ends
    actGetMediaSeries: (context, id) => {
        var baseUrl = context.getters.baseUrl;
        var user = JSON.parse(localStorage.getItem('altUser'));
        var domain = localStorage.getItem('visitedDomain');

        var urlParam = {
            params: {
                domain: domain,
                timestamp: Math.round(new Date() / 1000),
                order: 'asc'
            }
        };
        if (user && user.sessionToken) {
            urlParam.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/media/series/' + id, urlParam).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        // console.log('[actGetMediaSeries | response | ]', response);

                        resolve(response.body);
                    } else {
                        // console.log('[actGetMediaSeries | response error | ]', response);

                        reject(response.body);
                    }
                },
                (error) => {
                    // console.log('[player.js | actGetMediaSeries | error | ]', error);

                    reject(error.body);
                }
            );
        });
    },
    actGetSeasons: (context, seriesId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        var requestObj = {
            params: {
                domain: domain,
                order: 'asc'
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/series/' + seriesId + '/seasons', requestObj
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log(error);
                    reject(error.body);
                }
            )
        });
    },
    actGetSeasonInfo: (context, reqObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        var requestObj = {
            params: {
                domain: domain,
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/series/' + reqObj.seriesId + '/seasons/' + reqObj.seasonId, requestObj
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log(error);
                    reject(error.body);
                }
            )
        });
    },
    actGetEpisodes: (context, episodeObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        // console.log('[player.js | actGetEpisodes | episodeObj | ]', episodeObj);

        var requestObj = {
            params: {
                domain: domain,
                limit: episodeObj.limit,
                offset: episodeObj.offset,
                order: 'asc'
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/series/' + episodeObj.seriesId + '/seasons/' + episodeObj.seasonId + '/episodes', requestObj
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    reject(error.body)
                }
            );
        });
    },
    actGetAllEpisodes: (context, episodeObj) => {
        // console.log('[player.js | actGetAllEpisodes ]');

        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        // console.log('[player.js | actGetEpisodes | episodeObj | ]', episodeObj);

        var requestObj = {
            params: {
                domain: domain,
                order: 'asc',
                limit: episodeObj.limit,
                offset: episodeObj.offset,
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/series/' + episodeObj.seriesId + '/seasons/' + episodeObj.seasonId + '/episodes', requestObj
            ).then((response) => {
                if (response.ok && response.status != 404) {
                    resolve(response.body);
                }
            }, (err) => {
                // console.log(err);
            })
        })  //  Promise ends
    },
    actGetSingleEpisode: (context, episodeObj) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        var requestObj = {
            params: {
                domain: domain,
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/series/' + episodeObj.seriesId + '/seasons/' + episodeObj.seasonId + '/episodes/' + episodeObj.contentId, requestObj
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        })  //  Promise ends
    },
    actGetRelatedVideos: (context, categoryMainId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        // console.log('[player.js | actGetEpisodes | categoryMainId | ]', categoryMainId);
        // console.log('[player.js | actGetEpisodes | domain | ]', domain);
        // console.log('[player.js | actGetEpisodes | user | ]', user);

        var requestObj = {
            params: {
                category_id: categoryMainId,
                no_series: true,
                domain: domain,
                limit: 50,
                offset: 0,
                order: 'asc',
                tags: 'type-movie'
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/videos', requestObj
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (err) => {
                    // console.log(err);
                }
            )
        })  //  Promise ends
    },
    actGetMediaAccess: (context, contentId) => {
        var baseUrl = context.getters.baseUrl;
        var user = JSON.parse(localStorage.getItem('altUser'));
        var homeDomain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            if (!user) {
                reject({ error: true, message: 'Userdata not available' });
            }
            if (!homeDomain) {
                reject({ error: true, message: 'unable to get domain data' });
            }

            Vue.http.post(baseUrl + '/accounts/media/' + contentId + '/access', '', {
                params: {
                    domain: homeDomain
                },
                headers: {
                    XSSESSION: user.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'Getting media access response Error' });
                    }
                },
                (error) => {
                    // console.log('[player.js | actGetMediaAccess | error | ]', error);

                    reject({ error: true, message: 'Getting media access Error' });
                }
            )
        })
    },  //  actGetMediaAccess
    actGetDrmTickt: (context, streamId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');

        // Get user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        var altDevice = JSON.parse(localStorage.getItem('altDevice'));
        var altOrder = JSON.parse(localStorage.getItem('altOrder'));

        // console.log('[player.js | actGetDrmTickt | altUser | ]', altUser);
        // console.log('[player.js | actGetDrmTickt | altDevice | ]', altDevice);
        // console.log('[player.js | actGetDrmTickt | altOrder | ]', altOrder);

        return new Promise((resolve, reject) => {
            if (!(altUser && altUser.sessionToken) || !(altDevice && altDevice.uuid)) {
                reject({ error: true, message: 'required parameters not available' });
            }

            Vue.http.post(
                baseUrl + '/player/drm/ticket?domain=' + domain,
                {
                    device_uuid: altDevice.uuid,
                    id: streamId
                },
                {
                    headers: {
                        XSSESSION: altUser.sessionToken
                    }
                }
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'error in getting drm ticket response' });
                    }
                },
                (error) => {
                    reject(error.body);
                }
            )
        });
    },
    actGetPlayerProgress: (context, mediaId) => {
        var baseUrl = context.getters.baseUrl;

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        var domain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            if (!altUser) reject({ error: true, message: 'user data not available' });

            Vue.http.get(baseUrl + '/player/progress/' + mediaId, {
                params: {
                    domain: domain,
                    timestamp: Math.floor(new Date() / 1000)
                },
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    // console.log('[player.js | actGetPlayerProgress | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ error: true, message: 'error in getting progress data' });
                    }
                },
                (error) => {
                    // console.log('[player.js | actGetPlayerProgress | error | ]', error);

                    reject(error.body);
                }
            );
        });
    },
    actPutPlayerProgress: (context, progressData) => {
        var baseUrl = context.getters.baseUrl;
        // Getting user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        var domain = localStorage.getItem('homeDomain');

        return new Promise((resolve, reject) => {
            if (!altUser) reject({ error: true, message: 'user data not available' });

            Vue.http.put(baseUrl + '/player/progress?domain=' + domain, progressData, {
                headers: {
                    XSSESSION: altUser.sessionToken
                }
            }).then(
                (response) => {
                    if (response.ok && response.status == 200) {
                        resolve(response.body)
                    } else {
                        reject({ code: response.status, message: 'player progress response error' });
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'player progress error' });
                }
            );
        });
    },
    actGetSeriesSeasons: (context, seriesId) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');
        var user = JSON.parse(localStorage.getItem('altUser'));

        var requestObj = {
            params: {
                domain: domain,
                order: 'asc'
            }
        };
        if (user && user.sessionToken) {
            requestObj.headers = {
                XSSESSION: user.sessionToken
            }
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(
                baseUrl + '/media/series/' + seriesId + '/seasons', requestObj
            ).then(
                (response) => {
                    if (response.ok && response.status != 404) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log(error);
                    reject(error.body);
                }
            )
        });
    },
    actGetMediaHotspot: (context, datDetails) => {
        var baseUrl = context.getters.baseUrl;
        var user = JSON.parse(localStorage.getItem('altUser'));
        var domain = localStorage.getItem('visitedDomain');

        var urlParam = {
            params: {
                domain: domain,
                timestamp: Math.round(new Date() / 1000),
            }
        };
        if (user) {
            urlParam.headers = {
                XSSESSION: user.sessionToken
            }
        }

        // console.log('[player | actGetMediaVideo | urlParam | ]', urlParam);

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + datDetails).then(
                (response) => {
                    if (response.ok && response.status == 200) {

                        // console.log("[player details]"+response);

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
};

export default {
    state, getters, mutations, actions
};
