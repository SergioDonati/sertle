<template lang="pug">
	.page-wrapper
		div.clearfix
			.pull-left
				h2.no-m-t Fatture
					.btn-group.m-l-lg
						button.btn.btn-primary(v-on:click='list_type = "list"', :class='{ active: list_type == "list" }')
							span.fa.fa-bars
						button.btn.btn-primary(v-on:click='list_type = "blocks"', :class='{ active: list_type == "blocks" }')
							span.fa.fa-th-large
			.pull-right
				.input-group(style='width:300px;')
					input.form-control(type='text', v-model='searchKey')
					.input-group-btn
						button.btn.btn-default: span.fa.fa-search
		generic-list(driverMethod='getInvoices', :driverOptions='driverOptions')
			template(scope='props')
				.fbox.fbox-j-sb(v-if='list_type == "blocks"')
					.fbox-item.invoice.animated.slideInRight(v-for='invoice in props.items')
						.fbox-item.fbox.fbox-vertical.fbox-j-sb(style='height:100%')
							.fbox.fbox-j-sb
								router-link.text-uppercase.text-left(:to='"/invoice/"+invoice.$loki'): strong {{ getInvoiceNumber(invoice) }}
								div.text-muted.text-uppercase {{ new Date(invoice.date).toLocaleDateString() }}
							div.text-uppercase {{ invoice.nominee.name }}
							h5.text-right
								strong.text-muted Tot:
								b.m-l-xs.text-uppercase {{ invoice.tot }} &euro;
				div(v-if='list_type == "list"')
					table.table.table-hover.table-bordered.table-striped.table-responsive(style='background:white;')
						thead
							tr
								th Numero
								th Fatturato A
								th.text-right Totale
								th.text-right
									span.fa.fa-sort-amount-desc
									span.m-l-xs Data
						tbody
							tr(v-for='invoice in props.items')
								td: router-link(:to='"/invoice/"+invoice.$loki') {{ getInvoiceNumber(invoice) }}
								td: span.text-uppercase {{ invoice.nominee.name }}
								td.text-right: b.text-uppercase {{ invoice.tot }} &euro;
								td.text-right {{ new Date(invoice.date).toLocaleDateString() }}
</template>

<style scoped lang='less'>
	.invoice{
		min-width: 280px;
		background: white;
		padding: 20px;
		margin: 5px;
		width: 240px;
		box-shadow: 0px 0px 5px 0px #000;
	}
</style>

<script>
export default {
	name: 'Invoices',
	data () {
		return {
			searchKey: '',
			driverOptions: {
				filter: null,
				filterColumn: null
			},
			list_type:{
				type: String,
				default: 'blocks'
			}
		}
	},
	mounted: function(){
		this.list_type = 'blocks';
	},
	mixins: [require('../mixins/invoice')],
	watch:{
		searchKey(val){
			if(!val || !val.trim()) {
				this.driverOptions.filter = null;
				this.driverOptions.filterColumn = null;
				return;
			}
			this.driverOptions.filter = { '$regex': new RegExp(val, 'ig') };
			this.driverOptions.filterColumn = 'nominee.name';
		}
	}
}
</script>
