<template lang="pug">
	strapmodal(:open="open", :parent_loading='loading', :large='true', v-on:close="cancel", v-on:ok="ok", :modal_title="title", :ok_icon='"fa-check"', :ok_message="ok_message", close_message='Annulla')
		p(v-if='company') Numero telefonico della Società
			strong.m-l-xs.text-uppercase {{ company.name }}
		.container: .row
			.form-group(v-if='phone')
				label Numero
				.input-group
					input.form-control(type='text', v-model='phone.number')
			.form-group(v-if='phone')
				label Descrizione
				.input-group
					textarea.form-control(v-model='phone.description')
</template>

<script>
	const initialData = {
		loading: false,
		company: null,
		phone:null,
		index:null,
		error: null
	};
	const emptyPhone = {
		number: null,
		description: null
	};
	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		data: function(){
			return Object.assign({ open: this.initialOpen }, initialData);
		},
		mounted: function(){
			eventHub.$on('openCompanyAddressModal', (company, phone, index) => {
				this.show(company, phone, index);
			});
		},
		computed:{
			isNew: function(){
				return !this.phone;
			},
			title: function(){
				if(this.isNew) return 'Aggiungi Numero Telefonico';
				return 'Modifica Numero Telefonico';
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
			show: function(company, phone, index){
				if(this.open){
					console.warn('Modal già aperto, chiudilo prima.');
					return;
				}
				this.reset();
				this.company = company;
				if(!phone){
					this.phone = Object.assign({}, emptyPhone);
				}else{
					this.phone = phone;
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
					saveMethod = mainStore.state.dbDriver.addCompanyPhone(this.company.$loki, this.phone);
				}else{
					saveMethod = mainStore.state.dbDriver.updateCompanyPhone(this.company.$loki, this.index, this.phone);
				}
				saveMethod.then(response => {
					if(!response || !response.data) throw new Error('Invalid data.');
					eventHub.$emit('company-phones-updated');
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
