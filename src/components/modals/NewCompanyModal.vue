<template lang="pug">
	strapmodal(:open="open", :parent_loading='loading', :large='true', v-on:close="cancel", v-on:ok="ok", :ok_icon='"fa-check"', ok_message="Crea", :modal_title="title", close_message='Annulla')
		form.form.container-fluid: .row
			h5 Generali
				field-group(label='Ragione Sociale', placeholder='Mario Rossi', :autofocus='true', v-model='company.name')
				.container-flex
					.flex-col
						field-group(label='Partita IVA', placeholder='00000000000', v-model='company.piva')
					.flex-col
						field-group(label='Codice Fiscale', placeholder='AAABBB00A00B000C', v-model='company.fiscalCode')
			h5 Indirizzo
			.container-flex
				.flex-col: field-group(label='Strada', v-model='address.street', placeholder='via Aretina')
				.flex-col: field-group(label='N. Civico', v-model='address.civicNumber', placeholder='32')
			.container-flex
				.flex-col: field-group(label='Città', v-model='address.city', placeholder='Siena')
				.flex-col: field-group(label='CAP', v-model='address.postalcode', placeholder='53100')
				.flex-col: select-field-group(label='Nazione', v-model='address.nation', :options='nationsOptions')
			h5 Telefono
			field-group(label='Telefono', v-model='phone.number', placeholder='0000112233')
</template>

<style lang="less" scoped>
	.container-flex{
		display: flex;
		flex-direction: row;
		.flex-col{
			flex: 1;
			margin-left: 10px;
		}
	}
</style>

<script>
	import driver from '@/DBDriver';
	import nationsOptions from '@/commons/nationOptions';
	const emptyCompany = {
		name: null,
		piva: null,
		fiscalCode:null,
		addresses:[],
		phones:[]
	};
	const emptyAddress = {
		city: null,
		street: null,
		number: null,
		postalCode: null,
		nation: nationsOptions[0]
	};
	const emptyPhone = {
		description: null,
		number: null
	};
	const initialData = {
		loading: false,
		error: null,
		errors: {},
		company: Object.assign({}, emptyCompany),
		address: Object.assign({}, emptyAddress),
		phone: Object.assign({}, emptyPhone),
		title: "Nuova Compagnia"
	};

	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		data: function(){
			return Object.assign({ open: this.initialOpen, nationsOptions: nationsOptions }, initialData);
		},
		mounted: function(){
			eventHub.$on('openNewCompanyModal', (...args) => {
				this.show(...args);
			});
		},
		methods:{
			reset: function(){
				Object.assign(this.$data, initialData);
			},
			show: function(){
				if(this.open){
					console.warn('Modal già aperto, chiudilo prima.');
					return;
				}
				this.reset();
				this.open = true;
				return this;
			},
			cancel: function(){
				this.open = false;
				this.$off('ok');
				this.$emit('cancel');
			},
			ok: function(){
				const newCompany = Object.assign({}, this.company);
				newCompany.addresses.push(Object.assign({}, this.address));
				newCompany.phones.push(Object.assign({}, this.phone));
				driver.createCompany(newCompany).then(response => {
					this.open = false;
					this.$off('cancel');
					this.$emit('ok', response);
				}).catch(e =>{
					this.error = e;
				});
			}
		},
		watch:{
			'searchInput': {
				handler: function(newValue){
					this.searchName(newValue);
				}
			}
		}
	}
</script>
