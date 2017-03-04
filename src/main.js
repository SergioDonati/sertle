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

Vue.component('strapmodal', require('./components/modals/BootstrapModal.vue'));
Vue.component('confirmModal', require('./components/modals/ConfirmModal.vue'));
Vue.component('loadingModal', require('./components/modals/LoadingModal.vue'));

window.eventHub = new Vue({});

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
	template: '<div><component v-for="name in modals" :ref="name" :is="name" ></component></div>',
	methods:{
		getModal(name){
			const a = this.$refs[name];
			if(a instanceof Array && a.length>0){
				return a[0]
			}else{
				return a;
			}
		},
		addModal(name){
			if(this.modals.indexOf(name) != -1) return this.getModal(name);
			this.modals.push(name);
			return this.getModal(name);
		}
	}
});



Vue.component('companyAddressEditModal', require('./components/modals/companyAddressEditModal.vue'));
Vue.component('companyPhoneEditModal', require('./components/modals/companyPhoneEditModal.vue'));
modalsManager.addModal('confirm-modal');
modalsManager.addModal('loading-modal');
modalsManager.addModal('company-address-edit-modal');
modalsManager.addModal('company-phone-edit-modal');
