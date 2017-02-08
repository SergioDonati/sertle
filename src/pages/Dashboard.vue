<template lang="pug">
	.jumbotron
		h2 Dashboard
		router-link(to='/test') Test
		companies-widget
</template>

<script>
import CompaniesWidget from '../widget/Companies.vue';
export default {
	name: 'Test',
	components:{
		CompaniesWidget: CompaniesWidget
	},
	data () {
		return {

		}
	}
}
</script>
