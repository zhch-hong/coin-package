/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import api from '../api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    offline: false,
    currentCoins: 0,
    connectPort: false,
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false,
    },
    device: 'desktop',
    isMaintenance: false, // 是否维护中
    /** 门店存票比率 */
    ticketScale: 0.1,
  },
  mutations: {
    SET_TICKETSCALE(state, value) {
      state.ticketScale = value;
    },
    SET_MAINTENANCE(state, preload) {
      state.isMaintenance = preload;
    },
    TOGGLE_OFFLINE: (state, flag) => {
      state.offline = flag;
    },
    UPDATE_CURRENT_COINS: (state, coins) => {
      state.currentCoins = coins;
    },
    UPDATE_CONNECT_PORT: (state, connectPort) => {
      state.connectPort = connectPort;
    },
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
  },
  actions: {
    getMachineCoinNum({ commit }) {
      api.getMachineCoinNum().then((res) => {
        commit('UPDATE_CURRENT_COINS', res.body.coinNum);
      });
    },
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device);
    },
  },
  getters: {
    sidebar: (state) => state.sidebar,
    device: (state) => state.device,
  },
});
export default store;
