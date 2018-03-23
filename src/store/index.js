import Vue from 'vue';
import Vuex from 'vuex';

import master from './modules/master';
import help from './modules/help';
import home from './modules/home';
import player from './modules/player';
import profile from './modules/profile';
import search from './modules/search';
import settings from './modules/settings';
import subscribe from './modules/subscribe';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    master, help, home, player, profile, search, settings, subscribe
  }
})
