<template lang="pug">
	.page-wrapper(v-if='invoice')
		.clearfix
			.pull-left
				.fbox
					h2.no-m-t.text-uppercase Fattura {{ getInvoiceNumber(invoice) }}
					.btn-group.m-l-md
						button.btn.btn-primary.btn-sm(v-if='show_tab == "overview"', v-on:click='showPDF')
							span.fa.fa-eye
							span.m-l-xs Guarda PDF
						button.btn.btn-primary.btn-sm(v-if='show_tab == "pdf"', v-on:click='show_tab = "overview"')
							span.fa.fa-pencil
							span.m-l-xs Panoramica
			.pull-right
				button.btn.btn-xs.btn-info.m-r-sm(v-if='show_tab != "edit"', v-on:click='show_tab = "edit"')
					span.fa.fa-pencil
					span.m-l-xs Modifica
				button.btn.btn-xs.btn-default.m-r-sm(v-if='show_tab == "edit"', v-on:click='show_tab = "overview"')
					span.fa.fa-close
					span.m-l-xs Annulla modifica
				small.text-muted {{ invoice_date }}
		invoice-overview.fbox(v-if='show_tab == "overview"', :invoice='invoice')
		invoice-editing.fbox(v-if='show_tab == "edit"', :invoice_id='invoice_id')

		iframe(v-if='iframeUrl && show_tab == "pdf"', :src="iframeUrl" style="width: 100%;height: 476px;")
		spinner(v-if='show_tab == "pdf" && !iframeUrl')
	.page-wrapper(v-else)
		spinner
</template>

<script>
import InvoiceEditing from '../components/InvoiceEditing.vue';
import InvoiceOverview from '../components/InvoiceOverview.vue';

const {ipcRenderer} = require('electron');

export default {
	name: 'Invoice',
	components: { 'InvoiceOverview': InvoiceOverview, 'InvoiceEditing': InvoiceEditing },
	data () {
		return {
			loading: false,
			error: null,
			invoice_id: null,
			invoice: null,
			iframeUrl: null,
			show_tab: 'overview'
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
		}
	},
	methods:{
		showPDF(){
			this.show_tab = 'pdf';
			if(this.iframeUrl) return;
			ipcRenderer.once('printInvoice-reply', (event, result) => {
				if(!result.success){
					window.console.log(result);
					alert(result.error.message);
					return;
				}
				const viewerPath = "../../libs/pdfjs/web/viewer.html";
				this.iframeUrl = viewerPath+'?file='+result.outputPath;
			});
			ipcRenderer.send('printInvoice', { invoice: this.invoice });
		},
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
