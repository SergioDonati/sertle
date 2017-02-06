'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(Vuex);

import { routes } from './router.js';
const router = new VueRouter({ routes });

const app = new Vue({
	router: router,
	el: '#body',
	render: h => h(App)
});
