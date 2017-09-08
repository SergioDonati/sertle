<template lang='pug'>
	div(v-if='invoice')
		div(style='margin-right:10px;')
			.blockue
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
							span.m-l-xs {{ payMethodString(invoice) }}
				.row(v-if='invoice.payMethod == 1')
					.col-xs-12.col-lg-6
						p
							strong Banca:
							span.m-l-xs {{ invoice.bankName }}
					.col-xs-12.col-lg-6
						p
							strong IBAN:
							span.m-l-xs {{ invoice.iban }}
			.blockue
				h5
					span {{ invoice.nominee.name }}
					router-link(:to='"/company/"+invoice.nomineeRef').m-l-sm: i.fa.fa-external-link
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
					th(style='min-width:100px;') Importo U. &euro;
					th Quantità
					th Unità
					th IVA %
					th Totale &euro;
				tbody
					tr(v-for='item in invoice.items')
						td {{ item.description }}
						td {{ item.price }}
						td {{ item.quantity }}
						td {{ getUnitLabel(item.unit) }}
						td {{ item.iva }}
						td {{ item.totPrice }}
					tr
						td(colspan='5')
						td {{ invoice.tot }}
</template>

<style scoped>
	.table-invoice-items{
		background: #fff;
		th{
			min-width: 80px;
		}
	}
</style>

<script>
import unitMap from '../commons/itemUnitMap';
export default {
	props:['invoice'],
	mixins: [require('../mixins/invoice')],
	name: 'InvoiceOverview',
	computed:{
		invoice_date: function(){
			return new Date(this.invoice.date).toLocaleDateString();
		}
	},
	methods:{
		getUnitLabel(unit){
			return unitMap[unit] ? unitMap[unit].label : '--';
		}
	}
}
</script>
