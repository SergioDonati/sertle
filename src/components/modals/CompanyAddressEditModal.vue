<template lang="pug">
	strapmodal(:open="open", :parent_loading='loading', :large='true', v-on:close="cancel", v-on:ok="ok", :modal_title="title", :ok_icon='"fa-check"', :ok_message="ok_message", close_message='Annulla')
		p(v-if='company') Indirizzo della Società
			strong.m-l-xs.text-uppercase {{ company.name }}
		.container-fluid: .row
			.col-md-6.col-lg-4.form-group(v-if='address')
				label Strada
				.input-group
					input.form-control(type='text', v-model='address.street')
			.col-md-6.col-lg-4.form-group(v-if='address')
				label Numero
				.input-group
					input.form-control(type='text', v-model='address.number')
			.col-md-6.col-lg-4.form-group(v-if='address')
				label CAP
				.input-group
					input.form-control(type='text', v-model='address.postalCode')
			.col-md-6.col-lg-4.form-group(v-if='address')
				label Città
				.input-group
					input.form-control(type='text', v-model='address.city')
			.col-md-6.col-lg-4.form-group(v-if='address')
				label Nazione
				.input-group
					select.form-control(type='text', v-model='address.nation')
						option(value='Italia') Italia
</template>

<script>
	const initialData = {
		loading: false,
		company: null,
		address:null,
		index:null,
		error: null,
		isNew: false
	};
	const emptyAddress = {
		city: null,
		street: null,
		nation: 'Italia',
		number: null,
		postalCode: null
	};
	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		data: function(){
			return Object.assign({ open: this.initialOpen }, initialData);
		},
		mounted: function(){
			eventHub.$on('openCompanyAddressModal', (company, address, index) => {
				this.show(company, address, index);
			});
		},
		computed:{
			title: function(){
				if(this.isNew) return 'Aggiungi Indirizzo';
				return 'Modifica Indirizzo';
			},
			ok_message: function(){
				if(this.isNew) return 'Aggiungi';
				return 'Salva';
			}
		},
		methods:{
			reset: function(){
				Object.assign(this.$data, initialData);
			},
			show: function(company, address, index){
				if(this.open){
					console.warn('Modal già aperto, chiudilo prima.');
					return;
				}
				this.reset();
				this.company = company;
				if(!address){
					this.address = Object.assign({}, emptyAddress);
					this.isNew = true;
				}else{
					this.address = address;
					this.index = index;
				}
				this.open = true;
				return this;
			},
			ok: function(){
				console.log('clicked');
				this.loading = true;
				let saveMethod = null;
				if(this.isNew){
					saveMethod = mainStore.state.dbDriver.addCompanyAddress(this.company.$loki, this.address);
				}else{
					saveMethod = mainStore.state.dbDriver.updateCompanyAddress(this.company.$loki, this.index, this.address);
				}
				saveMethod.then(response => {
					if(!response || !response.data) throw new Error('Invalid data.');
					eventHub.$emit('company-addresses-updated');
					this.open = false;
					this.$off('cancel');
					this.$emit('ok');
				}).catch(e =>{
					console.error(e);
					this.error = e;
				}).then(() =>{
					this.loading = false;
				});
			},
			cancel: function(){
				this.open = false;
				this.$off('ok');
				this.$emit('cancel');
			}
		}
	}
</script>
