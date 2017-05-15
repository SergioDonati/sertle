<template lang='pug'>
	.company-phone.fbox.fbox-vertical
		.phone-label
			p Numero:
				strong.m-l-xs {{ phone.number }}
			p(v-if='phone.description') Descrizione: {{ phone.description }}
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
		phone: Object,
		index: Number,
		company: Object
	},
	name: 'CompanyPhone',
	data: function(){
		return {
			loading: true,
			errors: {},
			error_message: null,
			input_value: this.value,
			show_edit: false
		};
	},
	computed:{

	},
	methods:{
		editClick(){
			modalsManager.getModal('company-phone-edit-modal').show(this.company, this.phone, this.index);
		}
	}
}
</script>
