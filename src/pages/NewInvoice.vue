<template lang="pug">
	.page-wrapper(v-if="!loading")
		.clearfix
			.pull-left
				.fbox
					h2.no-m-t.text-uppercase Fattura {{ invoice_number }}
						small.text-muted {{ invoice_date }}
					.btn-group.m-l-md
						button.btn.btn-primary.btn-sm(v-if="invoice" v-on:click='save')
							span.fa.fa-eye
							span.m-l-xs Salva
		invoice-editing.fbox(:new_invoice="true", v-on:invoice-changed="changed")
	.page-wrapper(v-else)
		spinner
</template>

<script>
import InvoiceEditing from '../components/InvoiceEditing.vue';

const {ipcRenderer} = require('electron');

export default {
	name: 'NewInvoice',
	components: { 'InvoiceEditing': InvoiceEditing },
	data () {
		return {
			loading: false,
			error: null,
			invoice: null
		}
	},
	mixins: [require('../mixins/invoice')],
	mounted: function(){
		setTimeout(()=>{
			eventHub.$emit('hideSidebar');
		}, 100);

	},
	computed:{
		invoice_date: function(){
			try{
				return new Date(this.invoice.date).toLocaleDateString();
			}catch(e){
				return "---";
			}
		},
		invoice_number: function(){
			try{
				if(!this.invoice) return '-';
				return this.getInvoiceNumber(this.invoice)
			}catch(e){
				return "-";
			}
		}
	},
	methods:{
		changed(invoice){
			this.invoice = invoice;
		},
		save(){}
	},
	watch:{
		'$route': function (to, from) {
			// force create a new empty invoice ??
		}
	}
}
</script>
