<template lang='pug'>
	div
		h4: b Numeri telefonici
		.fbox.fbox-vertical
			company-phone.company-phone(v-for='(phone, index) in company.phones', :key="phone.id", :company='company', :phone='phone', :index='index')
</template>

<style scoped>
	.company-phone{
		padding:15px;
		background: #214e75;
		color: white;
		box-shadow: 0px 0px 5px 1px #ccc;
	}
</style>

<script>
import CompanyPhone from '../components/CompanyPhone.vue';
export default {
	props:{
		company: Object
	},
	name: 'CompanyPhones',
	components:{
		CompanyPhone:CompanyPhone
	},
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
