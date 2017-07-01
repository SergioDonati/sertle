<template lang="pug">
	strapmodal(:open="open", :parent_loading='loading', :large='true', v-on:close="cancel", v-on:ok="ok", :modal_title="title", :ok_icon='"fa-check"', :ok_message="ok_message", close_message='Annulla')
		form.container-fluid(ref='m_form', v-if='item'): .row
			.form-group(:class='{"has-error": errors.description}')
				label Descrizione
				.input-group(style='width:100%;')
					textarea.form-control(v-model='item.description', required)
				span.help-block(v-if='errors.descriptions') {{errors.description.message}}
			.fbox.fbox-j-sb.fbox-a-e
				.form-group(style='width:250px;')
					label Prezzo unitario
					.input-group
						input.form-control(type='number', v-model='item.price', step="0.01", min="0", placeholder='49.53', required)
						.input-group-addon €
				.form-group(style='width:150px;')
					label Quantità
					.input-group
						input.form-control(type='number', v-model='item.quantity', placeholder='10', min="0", required)
						.input-group-addon(if='item.unit && unitMap[item.unit]') {{unitMap[item.unit].label}}
				.form-group(style='width:250px;')
					label Prezzo totale
					.input-group
						input.form-control(type='number', v-model='item.totPrice', step="0.01", min='0', placeholder='495.3', required)
						.input-group-addon €
			.fbox.fbox-a-e
				.form-group(style='width:250px;')
					label Unità
					.input-group
						select.form-control(type='number', v-model='item.unit', required)
							option(v-for='unit in unitMap', :value='unit.value') {{unit.label}}
				.form-group(style='width:150px;')
					label IVA
					.input-group
						input.form-control(type='number', v-model='item.iva', min="0", required)
						.input-group-addon %
</template>

<script>
	const initialData = {
		loading: false,
		item:null,
		error: null,
		errors: {},
		edited: false,
		isNew: false
	};
	const emptyItem = {
		discount: 0,
		description: null,
		imponibile: 0,
		imposta: 0,
		iva: mainStore.getters.defaultIVA || 22,
		price: 0,
		quantity: 1,
		totPrice: 0,
		unit: 'nr'
	};
	const unitMap = require('../../commons/itemUnitMap');
	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		mixins: [require('../../mixins/invoice/invoice_item')],
		data: function(){
			return Object.assign({ open: this.initialOpen }, initialData);
		},
		mounted: function(){
			eventHub.$on('openInvoiceItemModal', (item) => {
				this.show(item);
			});
		},
		computed:{
			title: function(){
				if(this.isNew) return 'Aggiungi Elemento in Fattura';
				return 'Modifica Elemento in Fattura';
			},
			ok_message: function(){
				if(this.isNew) return 'Aggiungi';
				return 'Salva';
			},
			unitMap: function(){
				return unitMap;
			}
		},
		methods:{
			reset: function(){
				Object.assign(this.$data, initialData);
			},
			show: function(item){
				if(this.open){
					console.warn('Modal già aperto, chiudilo prima.');
					return;
				}
				this.reset();
				if(!item){
					this.item = Object.assign({}, emptyItem);
					this.isNew = true;
				}else{
					this.item = Object.assign({}, item);
				}
				this.open = true;
				return this;
			},
			ok: function(){
				this.errors = {};
				if(!this.$refs.m_form.checkValidity()) return;
				let hasErrors = false;
				if(!this.item.description || this.item.description.length < 2){
					this.errors.description = {
						message: 'La descrizione non può essere vuota'
					}
					hasErrors = true;
				}
				if(hasErrors) return;
				this.$off('cancel');
				this.$emit('ok', this.item, this.edited);
			},
			cancel: function(){
				this.open = false;
				this.$off('ok');
				this.$emit('cancel');
			}
		},
		watch:{
			'item.price': {
				handler: function(newValue){
					this.updateTot(this.item);
				},
				deep: true
			},
			'item.quantity': {
				handler: function(newValue){
					this.updateTot(this.item);
				},
				deep: true
			},
			'item.priceTot': {
				handler: function(newValue){
					this.updatePrice(this.item);
				},
				deep: true,
			},
			'item.iva': {
				handler: function(newValue){
					this.updateTot(this.item);
				},
				deep: true
			},
		}
	}
</script>
