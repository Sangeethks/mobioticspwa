import Vue from 'vue'

const state = {
    helpCategories: undefined,
    helpFaqPageTitle: undefined,
    activeHelpCategory: undefined,
    faqArticles: undefined,
};

const getters = {
    helpCategories: (state) => {
        return state.helpCategories;
    },
    helpFaqPageTitle: (state) => {
        return state.helpFaqPageTitle;
    },
    activeHelpCategory: (state) => {
        return state.activeHelpCategory;
    },
    faqArticles: (state) => {
        return state.faqArticles;
    },
};

const mutations = {
    setHelpCategories: (state, categories) => {
        state.helpCategories = categories;
    },
    setHelpFaqPageTitle: (state, title) => {
        state.helpFaqPageTitle = title;
    },
    setActiveHelpCategory: (state, category) => {
        state.activeHelpCategory = category;
    },
    setFaqArticles: (state, articles) => {
        state.faqArticles = articles;
    },
};

const actions = {
    /**
     * Help categories
     */
    actGetHelpCategories: (context) => {
        var altConfig = undefined;
        if (localStorage.getItem('altConfig')) {
            altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        return new Promise((resolve, reject) => {
            if (!altConfig) reject({ error: true, message: 'missing config data' });

            Vue.http.get(altConfig.freshdeskUrl + '/solution/categories.json', {
                headers: {
                    'Authorization': 'Basic ' + altConfig.freshDeskAPIKey
                }
            }).then(
                (response) => {
                    // console.log('[Help.js | actGetHelpCategories | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    reject(error);
                }
            )
        })
    },
    /**
     * Gets the faq results
     */
    actGetFaqResults: (context, faqObj) => {
        var altConfig = undefined;
        if (localStorage.getItem('altConfig')) {
            altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        return new Promise((resolve, reject) => {
            if (!altConfig) reject({ error: true, message: 'missing config data' });

            Vue.http.get(altConfig.freshdeskUrl + '/solution/categories/' + faqObj.categoryId + '/folders/' + faqObj.folderId + '.json', {
                headers: {
                    'Authorization': 'Basic ' + altConfig.freshDeskAPIKey
                }
            }).then(
                (response) => {
                    // console.log('[Help.js | actGetHelpCategories | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    reject(error);
                }
            )
        })
    },
    /**
     * send ticket
     */
    actSendTicket: (context, ticketObj) => {
        var altConfig = undefined;
        if (localStorage.getItem('altConfig')) {
            altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
            altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        return new Promise((resolve, reject) => {
            if (!(altUser)) reject({ error: true, message: 'missing user data' });

            if (!(altConfig)) reject({ error: true, message: 'missing config data' });

            Vue.http.post(altConfig.freshdeskUrl + '/helpdesk/tickets.json', ticketObj, {
                headers: {
                    'Authorization': 'Basic ' + altConfig.freshDeskAPIKey
                }
            }).then(
                (response) => {
                    // console.log('[Help.js | actSendTicket | response | ]', response);

                    if (response.ok && response.status == 200) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    // console.log('[Help.js | actSendTicket | error | ]', error);

                    reject(error);
                }
            )
        })
    },

};

export default {
    state, getters, mutations, actions
};
