<template lang='pug'>
	.company-address.fbox.fbox-vertical
		.address-label.text-uppercase
			p {{ address.street }}, {{ address.number }}
			p {{ address.postalCode }} {{ address.city }} {{ address.nation }}
		.btn-group.m-t-sm
			button.btn.btn-default(v-on:click='editClick')
				span.fa.fa-pencil
				span.m-l-xs Modifica
			button.btn.btn-danger
				span.fa.fa-close
				span.m-l-xs Elimina
</template>

<script>
export default {
	props:{
		address: Object,
		index: Number,
		company: Object
	},
	name: 'CompanyAddress',
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
		editClick(){
			modalsManager.getModal('company-address-edit-modal').show(this.company, this.address, this.index);
		}
	}
}
</script>
