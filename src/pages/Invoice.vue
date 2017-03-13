<template lang="pug">
	.page-wrapper(v-if='invoice')
		.clearfix
			.pull-left: h2.no-m-t.text-uppercase Fattura {{ getInvoiceNumber(invoice) }}
			.pull-right
				small.text-muted {{ invoice_date }}
		.fbox
			div(style='margin-right:10px;')
				.blue-block
					.row
						.col-xs-12.col-lg-6
							p
								strong Numero:
								span.m-l-xs {{ getInvoiceNumber(invoice) }}
						.col-xs-12.col-lg-6
							p
								strong Data:
								span.m-l-xs {{ invoice_date }}
					.row
						.col-xs-12.col-lg-6
							p
								strong Metodo di pagamento:
								span.m-l-xs {{ payMethodString }}
					.row(v-if='invoice.payMethod == 1')
						.col-xs-12.col-lg-6
							p
								strong Banca:
								span.m-l-xs {{ invoice.bankName }}
						.col-xs-12.col-lg-6
							p
								strong IBAN:
								span.m-l-xs {{ invoice.iban }}
				.blue-block
					h5: router-link(:to='"/company/"+invoice.nomineeRef') {{ invoice.nominee.name }}
					.row
						.col-xs-12.col-lg-6
							p
								strong Codice Fiscale:
								span.m-l-xs {{ invoice.nominee.fiscalCode }}
						.col-xs-12.col-lg-6
							p
								strong Partita IVA:
								span.m-l-xs {{ invoice.nominee.piva }}
					p {{ invoice.nominee.addresses[0].street }}, {{ invoice.nominee.addresses[0].number }}
					p {{ invoice.nominee.addresses[0].postalCode }} {{ invoice.nominee.addresses[0].city }} {{ invoice.nominee.addresses[0].nation }}
			.fbox-item
				table.table-invoice-items.table.table-bordered.table-striped
					thead: tr
						th Descrizione
						th Importo U. &euro;
						th Quantità
						th IVA %
						th Totale &euro;
					tbody
						tr(v-for='item in invoice.items')
							td {{ item.description }}
							td {{ item.price }}
							td {{ item.quantity }}
							td {{ item.iva }}
							td {{ item.totPrice }}
						tr
							td(colspan='4')
							td {{ invoice.tot }}

	.page-wrapper(v-else)
		spinner
</template>

<style scoped lang='less'>
	.table-invoice-items{
		background: #fff;
	}
	.blue-block{
		margin-bottom: 10px;
		padding:15px;
		background: #214e75;
		color: white;
		box-shadow: 0px 0px 5px 1px #ccc;
	}
</style>

<script>
export default {
	name: 'Invoice',
	data () {
		return {
			loading: false,
			error: null,
			invoice_id: null,
			invoice: null
		}
	},
	mixins: [require('../mixins/invoice')],
	mounted: function(){
		try{
			this.invoice_id = this.$route.params.invoice_id;
		}catch(e){}
		this.loadData();
		setTimeout(()=>{
			eventHub.$emit('hideSidebar');
		}, 100);
	},
	computed:{
		invoice_date: function(){
			return new Date(this.invoice.date).toLocaleDateString();
		},
		payMethodString: function(){
			if(this.invoice.payMethod == 0){
				return 'Rimessa Diretta';
			}else if(this.invoice.payMethod == 1){
				return 'Bonifico';
			}
		}
	},
	methods:{
		loadData(){
			this.loading = true;
			this.error = null;
			mainStore.state.dbDriver.getInvoice(this.invoice_id).then(response => {
				if(!response || !response.data) throw new Error('Invalid data.');
				this.invoice = response.data;
			}).catch(e =>{
				if(e && e.message){
					this.error = e.message;
				}
			}).then(()=>{
				this.loading = false;
			});
		}
	},
	watch:{
		'$route': function (to, from) {
			this.invoice_id = this.$route.params.invoice_id;
			this.loadData();
		}
	}
}
</script>
