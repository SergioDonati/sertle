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

import GenericList from './components/core/GenericList.vue'
import Spinner from './components/core/Spinner.vue'
import EditableField from './components/core/EditableField.vue'
import FieldGroup from './components/core/FieldGroup.vue'
import NumberFieldGroup from './components/core/NumberFieldGroup.vue'
import SelectFieldGroup from './components/core/SelectFieldGroup.vue'
import Strapmodal from './components/modals/BootstrapModal.vue'
import ConfirmModal from './components/modals/ConfirmModal.vue'
import LoadingModal from './components/modals/LoadingModal.vue'
Vue.component('genericList', GenericList);
Vue.component('spinner',  Spinner);
Vue.component('editableField', EditableField);
Vue.component('fieldGroup', FieldGroup);
Vue.component('numberFieldGroup', NumberFieldGroup);
Vue.component('selectFieldGroup', SelectFieldGroup);

Vue.component('strapmodal', Strapmodal);
Vue.component('confirmModal', ConfirmModal);
Vue.component('loadingModal', LoadingModal);

window.eventHub = new Vue({});

window.mainApp = new Vue({
	router: router,
	el: '#body',
	render: h => h(App)
});

mainApp.$router.beforeEach((to, from, next)=>{
	eventHub.$emit('showSidebar');
	next();
});

window.modalsManager = new Vue({
	el: '#modals',
	data:{
		modals: []
	},
	template: '<div><component v-for="name in modals" :key="name" :ref="name" :is="name" ></component></div>',
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

import {ipcRenderer, remote} from 'electron';
mainStore.commit('setUser', remote.getCurrentWindow().user);

import CompanyAddressEditModal from './components/modals/CompanyAddressEditModal.vue';
import CompanyPhoneEditModal from './components/modals/CompanyPhoneEditModal.vue'
import InvoiceItemModal from './components/modals/InvoiceItemModal.vue'
import CompanySelectionModal from './components/modals/CompanySelectionModal.vue'
import NewCompanyModal from './components/modals/NewCompanyModal.vue'
Vue.component('companyAddressEditModal', CompanyAddressEditModal);
Vue.component('companyPhoneEditModal', CompanyPhoneEditModal);
Vue.component('invoiceItemModal', InvoiceItemModal);
Vue.component('companySelectionModal', CompanySelectionModal);
Vue.component('newCompanyModal', NewCompanyModal);

modalsManager.addModal('confirm-modal');
modalsManager.addModal('loading-modal');
modalsManager.addModal('company-address-edit-modal');
modalsManager.addModal('company-phone-edit-modal');
modalsManager.addModal('invoice-item-modal');
modalsManager.addModal('company-selection-modal');
modalsManager.addModal('new-company-modal');