<template lang="pug">
	.page-wrapper
		div.clearfix
			.pull-left: h2.no-m-t Società
			.pull-right
				.input-group(style='width:300px;')
					input.form-control(type='text', v-model='searchKey')
					.input-group-btn
						button.btn.btn-default: span.fa.fa-search
		generic-list(driverMethod='getCompanies', :driverOptions='driverOptions')
			template(scope='props')
				.fbox
					.company.animated.slideInRight(v-for='company in props.items')
						.fbox.fbox-vertical.fbox-j-sb(style='height:100%')
							div
								router-link.text-uppercase.text-left(:to='"/company/"+company.$loki'): strong {{ company.name }}
								.text-left
									strong.text-muted PIVA:
									span.m-l-xs.text-uppercase {{ company.piva }}
								.text-left
									strong.text-muted C.Fis:
									span.m-l-xs.text-uppercase {{ company.fiscalCode }}
							.btn-group
								button.btn.btn-primary
									span.fa.fa-list
									span.m-l-xs Fatture
								button.btn.btn-success
									span.fa.fa-plus
</template>

<style scoped lang='less'>
	.company{
		background: white;
		padding: 20px;
		margin: 5px;
		width: 240px;
		box-shadow: 0px 0px 5px 0px #000;
	}
</style>

<script>
export default {
	name: 'Compagnies',
	data () {
		return {
			searchKey: '',
			driverOptions: {
				filter: null,
				filterColumn: null
			}
		}
	},
	watch:{
		searchKey(val){
			if(!val || !val.trim()) {
				this.driverOptions.filter = null;
				this.driverOptions.filterColumn = null;
				return;
			}
			this.driverOptions.filter = { '$regex': new RegExp(val, 'ig') };
			this.driverOptions.filterColumn = 'name';
		}
	}
}
</script>
