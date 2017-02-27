'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(Vuex);

import App from './App.vue';
import { routes } from './router.js';
const router = new VueRouter({ routes });

window.mainStore = new Vuex.Store(require('./stores/baseStore.js'));

Vue.component('genericList', require('./components/GenericList.vue'));
Vue.component('spinner', require('./components/Spinner.vue'));
Vue.component('editableField', require('./components/EditableField.vue'));

window.mainApp = new Vue({
	router: router,
	el: '#body',
	render: h => h(App)
});

window.modalsManager = new Vue({
	el: '#modals',
	data:{
		modals: []
	},
	template: '<div id="modals"><component v-for="name in modals" :ref="name" :is="name" ></component></div>',
	methods:{
		getModal(name){
			return this.$refs[name];
		},
		addModal(name){
			if(this.modals.indexOf(name) != -1) return this.getModal(name);
			this.modals.push(name);
			return this.getModal(name);
		}
	}
});
