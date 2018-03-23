import Vue from 'vue'

const state = {
    searchResults: undefined,
};

const getters = {
    searchResults: (state) => {
        return state.searchResults;
    },
};

const mutations = {
    setSearchResults: (state, results) => {
        state.searchResults = results;
    }
};

const actions = {
    actSearchQuery: (context, query) => {
        var baseUrl = context.getters.baseUrl;
        var domain = localStorage.getItem('visitedDomain');

        var altProfileMode = undefined;
        if (localStorage.getItem('altProfileMode')) {
            altProfileMode = localStorage.getItem('altProfileMode');
        } else {
            altProfileMode = 'default';
            localStorage.setItem('altProfileMode', altProfileMode);
        }

        var params = {
            query: query,
            domain: domain,
            limit: 20,
            offset: 0,
        };

        if (altProfileMode == 'kids') {
            params.tags = 'kids-content';
        }

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/media/videos', { params }).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Search query failed' });
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Search query failed' });
                }
            )
        });
    },
    // NOTE added by sumit for kids
    actSearchQueryKids: (context, query) => {
        var baseUrl = context.getters.baseUrl;
        var domain = context.getters.domain;

        return new Promise((resolve, reject) => {
            Vue.http.get(baseUrl + '/media/videos', {
                params: {
                    query: query,
                    domain: domain,
                    limit: 10,
                    offset: 0,
                    tags:"kids-content",
                },
            }).then(
                (response) => {

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    } else {
                        reject({ code: response.status, message: 'Search query failed' });
                    }
                },
                (error) => {
                    reject({ code: error.status, message: 'Search query failed' });
                }
            )
        });
    }
};

export default {
    state, getters, mutations, actions
};
