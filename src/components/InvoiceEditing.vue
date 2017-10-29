<template lang='pug'>
	div(v-if="error")
		.alert.alert-danger
			p {{error}}
	div(v-else-if='invoice && !error')
		div(style='margin-right:10px;flex:0.4;')
			.blockue
				.row
					.col-xs-12
						number-field-group(label='Numero' type="number" v-model='invoice.progressiveNumber' placeholder='1')
					.col-xs-12
						.form-group
							label Data:
							input.form-control.m-l-xs(type='date', :value='(new Date(invoice.date)).toJSON().slice(0,10)', v-on:input='inputDate')
				.row: .col-xs-12
					.form-group
						label Metodo di pagamento:
						select.form-control.m-l-xs(v-model='invoice.payMethod')
							option(disabled value="") Please select one
							option(v-for='opt in payMethodOptions()', :key='opt.value', :value='opt.value') {{opt.label}}
				.row(v-if='invoice.payMethod == 1')
					.col-xs-12.col-lg-6
						field-group(label='Banca', v-model='invoice.bank', placeholder='NomeBanca')
					.col-xs-12.col-lg-6
						field-group(label='IBAN', v-model='invoice.iban', placeholder='IT000011112222')
			.blockue.nominee(v-if="nominee")
				a.btn.close-company(title="cambia", v-on:click="selectCompany"): span.fa.fa-close
				h5
					span {{ nominee.name }}
					router-link(:to='"/company/"+invoice.nomineeRef').m-l-sm: i.fa.fa-external-link
				.row
					.col-xs-12.col-lg-6
						p
							strong Codice Fiscale:
							span.m-l-xs {{ nominee.fiscalCode }}
					.col-xs-12.col-lg-6
						p
							strong Partita IVA:
							span.m-l-xs {{ nominee.piva }}
				p {{ nominee.addresses[0].street }}, {{ nominee.addresses[0].number }}
				p {{ nominee.addresses[0].postalCode }} {{ nominee.addresses[0].city }} {{ nominee.addresses[0].nation }}
			.blockue(v-if="!nominee")
				h5 Seleziona il cliente
				button.btn.btn-primary(v-on:click="selectCompany")
					span.fa.fa-search
					span.m-l-xs Cerca
		.fbox-item.fbox
			table.table-invoice-items.table.table-bordered.table-striped
				thead: tr
					th Descrizione
					th(style='min-width:100px;') Importo U. &euro;
					th Quantità
					th Unità
					th IVA %
					th Totale &euro;
					th
				tbody
					tr(v-for='item, i in invoice.items')
						td {{ item.description }}
						td {{ item.price }}
						td {{ item.quantity }}
						td {{ getUnitLabel(item.unit) }}
						td {{ item.iva }}
						td {{ item.totPrice }}
						td
							.btn-group
								button.btn.btn-primary.btn-sm(v-on:click='addItem(item)')
									span.fa.fa-pencil
								button.btn.btn-danger.btn-sm(v-on:click='removeItem(item,i)')
									span.fa.fa-close
					tr
						td.text-right(colspan='6')
							button.btn.btn-primary.btn-sm(v-on:click='addItem()')
								span.fa.fa-plus
								span.m-l-xs Aggiungi elemento
					tr
						td(colspan='5')
						td {{ invoice.tot }}
						td
			.btn-group.text-right(v-if="needToSave && !new_invoice")
				button.btn.btn-primary(v-on:click="save")
					span.fa.fa-save
					span.m-l-xs Salva Modifiche
</template>

<style scoped>
	.table-invoice-items{
		background: #fff;
		th{
			min-width: 80px;
		}
	}
	input, select{
		color: #333;
	}
	.fbox-item.fbox{
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
	}
	.close-company{
		position: absolute;
		right: 0;
		top: 0;
	}
	.blockue.nominee{
		position: relative;
	}
</style>

<script>
import unitMap from '../commons/itemUnitMap';
export default {
	props:['invoice_id', 'new_invoice'],
	data:function(){
		return {
			invoice: null,
			error: null,
			loading: false,
			needToSave: false,
			unitMap: unitMap,
			company: null
		};
	},
	mixins: [require('../mixins/invoice')],
	name: 'InvoiceEditing',
	computed:{
		invoice_date: function(){
			return new Date(this.invoice.date).toLocaleDateString();
		},
		nominee: function(){
			return this.company;
		}
	},
	mounted:function(){
		this.loadData();
	},
	methods:{
		loadData(){
			this.loading = true;
			this.error = null;
			if(this.new_invoice == true){
				mainStore.state.dbDriver.getEmptyInvoice().then(response => {
					if(!response || !response.data) throw new Error('Invalid data.');
					this.invoice = response.data;
					this.needToSave = true;
					this.$emit("invoice-changed", this.invoice);
				}).catch(e =>{
					if(e && e.message){
						this.error = e.message;
					}
				}).then(()=>{
					this.loading = false;
				});
			}else{
				mainStore.state.dbDriver.getInvoice(this.invoice_id).then(response => {
					if(!response || !response.data) throw new Error('Invalid data.');
					this.invoice = response.data;
					this.company = this.invoice.nominee;
				}).catch(e =>{
					if(e && e.message){
						this.error = e.message;
					}
				}).then(()=>{
					this.loading = false;
				});
			}
		},
		inputDate(event){
			this.invoice.date = event.srcElement.value;
		},
		addItem(eItem){
			modalsManager.getModal('invoice-item-modal').show(eItem).$once('ok', (item)=>{
				if (eItem) Object.assign(eItem, item);
				else this.invoice.items.push(item);
				mainStore.state.dbDriver.recalcInvoice(this.invoice)
				this.needToSave = true;
			});
		},
		removeItem(eitem, i){
			this.invoice.items.splice(i, 1);
			mainStore.state.dbDriver.recalcInvoice(this.invoice);
			this.needToSave = true;
		},
		getUnitLabel(unit){
			return unitMap[unit] ? unitMap[unit].label : '--';
		},
		save(){
			this.loading = true;
			this.error = null;
			mainStore.state.dbDriver.updateInvoice(this.invoice).then(response =>{
				if(!response || !response.data) throw new Error('Invalid data.');
				this.$emit("invoice-changed");
			}).catch(e =>{
				if(e && e.message){
					this.error = e.message;
				}
			}).then(()=>{
				this.loading = false;
			});
		},
		selectCompany(){
			modalsManager.getModal('company-selection-modal').show().$once('selected', (company)=>{
				this.invoice.nominee = Object.assign({}, company);
				this.company = this.invoice.nominee;
				this.$emit("invoice-changed", this.invoice);
			});
		}
	},
	watch:{
		invoice:{
			handler: function(newValue, oldValue){
				if (!oldValue) return;
				this.needToSave = true;
			},
			deep:true
		}
	}
}
</script>
