'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import App from './InvoiceA4App/index.vue';

Vue.component('genericList', require('./components/core/GenericList.vue'));
Vue.component('spinner', require('./components/core/Spinner.vue'));

window.eventHub = new Vue({});

window.mainApp = new Vue({
	el: '#body',
	render: h => h(App)
});
