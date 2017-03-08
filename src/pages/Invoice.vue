<template lang="pug">
	.page-wrapper(v-if='invoice')
		.clearfix
			.pull-left: h2.no-m-t.text-uppercase Fattura {{ getInvoiceNumber(invoice) }}
			.pull-right
				small.text-muted {{ new Date(invoice.date).toLocaleDateString() }}
		.fbox
			div
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
	components:{
	},
	mounted: function(){
		try{
			this.invoice_id = this.$route.params.invoice_id;
		}catch(e){}
		this.loadData();
		eventHub.$emit('hideSidebar');
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
