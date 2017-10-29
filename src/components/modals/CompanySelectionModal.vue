<template lang="pug">
	strapmodal(:open="open", :parent_loading='loading', :large='true', v-on:close="cancel", :show_footer="false", :modal_title="title", close_message='Annulla')
		.fbox.fbox-j-sb.fbox-a-c
			form.container-fluid.fbox-item: .row
				.form-group
					label Filtra
					.input-group(style='width:100%;')
						input.form-control(type='text', v-model='searchInput')
						.input-group-addon: span.fa.fa-search
			.btn-group.m-l-lg
				button.btn.btn-primary(v-on:click='newCompany')
					span.fa.fa-plus
				button.btn.btn-primary(v-on:click='list_type = "list"', :class='{ active: list_type == "list" }')
					span.fa.fa-bars
				button.btn.btn-primary(v-on:click='list_type = "blocks"', :class='{ active: list_type == "blocks" }')
					span.fa.fa-th-large
		generic-list(driverMethod='getCompanies', :driverOptions='driverOptions')
			template(scope='props')
				div(v-if="props.items.length==0")
					p Nessun risultato trovato
				.fbox.fbox-j-sb(v-if='list_type == "blocks" && props.items.length>0')
					.company.animated.slideInRight(v-for='company in props.items')
						.fbox.fbox-vertical.fbox-j-sb(style='height:100%')
							div
								.text-uppercase.text-left: strong {{ company.name }}
								.text-left(v-if="company.piva")
									strong.text-muted PIVA:
									span.m-l-xs.text-uppercase {{ company.piva }}
								.text-left(v-if="company.fiscalCode")
									strong.text-muted C.Fis:
									span.m-l-xs.text-uppercase {{ company.fiscalCode }}
							.btn-group
								button.btn.btn-primary.btn-sm(v-on:click="select(company)") Seleziona
				div(v-if='list_type == "list" && props.items.length>0')
					table.table.table-hover.table-bordered.table-striped.table-responsive(style='background:white;')
						thead
							tr
								th Ragione Sociale
								th P.IVA/C.F.
								th
						tbody
							tr.company-table-row(v-for='company in props.items')
								td: strong {{company.name}}
								td: span.text-uppercase {{ company.piva }}/{{company.fiscalCode}}
								td: button.btn.btn-primary.btn-sm(v-on:click="select(company)") Seleziona
</template>

<style scoped lang='less'>
	.company{
		background: white;
		padding: 20px;
		margin: 5px;
		width: 240px;
		box-shadow: 0px 0px 5px 0px #000;
		color: initial;
	}
	.table{
		color:initial;
	}
</style>

<script>
	const initialData = {
		loading: false,
		selectedCompany:null,
		error: null,
		errors: {},
		searchInput: null,
		list_type: "list",
		title: "Seleziona Compagnia",
		driverOptions: {
			filter: null,
			filterColumn: null
		}
	};

	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		data: function(){
			return Object.assign({ open: this.initialOpen }, initialData);
		},
		mounted: function(){
			eventHub.$on('openCompanySelectionModal', (...args) => {
				this.show(...args);
			});
		},
		methods:{
			reset: function(){
				Object.assign(this.$data, initialData);
			},
			show: function(){
				if(this.open){
					console.warn('Modal già aperto, chiudilo prima.');
					return;
				}
				this.reset();
				this.open = true;
				return this;
			},
			select: function(company){
				this.selectedCompany = company;
				this.open = false;
				this.$off('cancel');
				this.$off('ok');
				this.$emit('selected', company);
			},
			cancel: function(){
				this.selectedCompany = null;
				this.open = false;
				this.$off('ok');
				this.$off('selected');
				this.$emit('cancel');
			},
			searchName: function(val){
				if(!val || !val.trim()) {
					this.driverOptions.filter = null;
					this.driverOptions.filterColumn = null;
					return;
				}
				this.driverOptions.filter = { '$regex': new RegExp(val, 'ig') };
				this.driverOptions.filterColumn = 'name';
			},
			newCompany: function(){
				this.open = false;
				this.$off('ok');
				modalsManager.getModal('new-company-modal').show().$once('ok', (company)=>{
					if(company) this.select(company);
					else this.open = true;
				}).$once('cancel', ()=>{ this.open = true; });
			}
		},
		watch:{
			'searchInput': {
				handler: function(newValue){
					this.searchName(newValue);
				}
			}
		}
	}
</script>
