<template lang="pug">
	.widget.flex-container
		router-link(to='invoices'): h5 {{ count }} Fatture
		router-link(to='/new/invoice', tag="button").btn.btn-primary
			span.fa.fa-plus
			span.m-l-xs Nuova
</template>

<script>
	import driver from '../DBDriver';

	export default {
		name: 'InvoicesWidget',
		data () {
			return {
				count: 0
			}
		},
		mounted:function(){
			driver.getInvoicesCount().then(response => {
				this.count = response.data;
			});
		},
		methods:{
			newInvoice(){

			}
		}
	}
</script>
