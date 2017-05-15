<template lang="pug">
	.page-wrapper(v-if='company')
		.clearfix
			.pull-left: h2.no-m-t.text-uppercase {{ company.name }}
			.pull-right
				.btn-group(style='width:300px;')
					button.btn.btn-danger.btn-xs.pull-right(bind-event, bind-event-click="deleteCompany")
						span.fa.fa-close
						span.m-l-xs Elimina
		.clearfix
			editable-field.editable-field-name(:value='company.name', :showNotEditable='false', editText='Modifica la Ragione Sociale' fieldName='name', v-on:update='updateField')
		.fbox
			editable-field.editable-field(:value='company.piva', label='Partita IVA', fieldName='piva', v-on:update='updateField')
			editable-field.editable-field(:value='company.fiscalCode', label='Codice Fiscale', fieldName='fiscalCode', v-on:update='updateField')
		.clearfix
		.fbox.m-l-sm.m-r-sm.company-books
			company-addresses.fbox-item(:company='company')
			company-phones.fbox-item(:company='company')

	.page-wrapper(v-else)
		spinner
</template>

<style scoped lang='less'>
	.editable-field{
		max-width: 300px;
		margin: 10px;
	}
	.editable-field-name{
		max-width: 500px;
	}
	.company-books{
		margin-left: 10px;
		margin-right: 10px;
	}
</style>

<script>
import CompanyAddresses from '../components/CompanyAddresses.vue';
import CompanyPhones from '../components/CompanyPhones.vue';

export default {
	name: 'Company',
	data () {
		return {
			loading: false,
			error: null,
			company_id: null,
			company: null
		}
	},
	components:{
		CompanyAddresses: CompanyAddresses,
		CompanyPhones: CompanyPhones
	},
	mounted: function(){
		try{
			this.company_id = this.$route.params.company_id;
		}catch(e){}
		this.loadData();
		eventHub.$on('company-addresses-updated', ()=>{
			this.loadData();
		});
	},
	methods:{
		loadData(){
			this.loading = true;
			this.error = null;
			mainStore.state.dbDriver.getCompany(this.company_id).then(response => {
				if(!response || !response.data) throw new Error('Invalid data.');
				this.company = response.data;
			}).catch(e =>{
				if(e && e.message){
					this.error = e.message;
				}
			}).then(()=>{
				this.loading = false;
			});
		},
		updateField:function(data){
			mainStore.state.dbDriver.updateCompanyField(this.company_id, {
				fieldName: data.fieldName,
				newValue: data.newValue
			}).then(response => {
				if(!response || !response.data) throw new Error('Invalid data.');
				this.company = response.data;
				data.caller.updateSuccess();
			}).catch(e =>{
				data.caller.updateFail(e);
			});
		}
	},
	watch:{
		'$route': function (to, from) {
			this.company_id = this.$route.params.company_id;
			this.loadData();
		}
	}
}
</script>
