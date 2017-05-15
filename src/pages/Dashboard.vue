<template lang="pug">
	.row
		.col-md-6
			companies-widget
		.col-md-6
			invoices-widget
</template>

<script>
import CompaniesWidget from '../widget/Companies.vue';
import InvoicesWidget from '../widget/Invoices.vue';

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
