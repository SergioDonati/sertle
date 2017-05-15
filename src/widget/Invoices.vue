<template lang="pug">
	.widget.flex-container
		router-link(to='invoices'): h5 Fatture
		p {{ count }}
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
			driver.getCompaniesCount().then(response => {
				this.count = response.data;
			});
		}
	}
</script>
