<template lang="pug">
	.row
		.col-md-6
			companies-widget
		.col-md-6
			invoices-widget
</template>

<script>
import CompaniesWidget from '../components/widget/Companies.vue';
import InvoicesWidget from '../components/widget/Invoices.vue';

export default {
	name: 'Dashboard',
	components:{
		CompaniesWidget: CompaniesWidget,
		InvoicesWidget: InvoicesWidget
	},
	data () {
		return {

		}
	}
}
</script>
