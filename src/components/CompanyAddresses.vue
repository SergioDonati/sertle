<template lang='pug'>
	.company-addresses.fbox.fbox-vertical
		h4: b Indirizzi
		.fbox.fbox-vertical.m-r-md
			company-address.fbox-item(v-for='address, index in company.addresses', :company='company', :address='address', :index='index')
</template>

<style scoped>
	.company-address{
		padding:15px;
		background: #214e75;
		color: white;
		box-shadow: 0px 0px 5px 1px #ccc;
	}
</style>

<script>
import CompanyAddress from '../components/CompanyAddress.vue';

export default {
	props:{
		company: Object
	},
	components:{
		CompanyAddress: CompanyAddress
	},
	name: 'CompanyAddresses',
	data: function(){
		return {
			loading: true,
			errors: {},
			error_message: null,
			input_value: this.value,
			show_edit: false
		};
	},
	methods:{

	}
}
</script>
