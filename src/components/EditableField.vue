<template lang='pug'>
	.form-group(v-if='!show_edit')
		label(v-if='label') {{ label }}
		.input-group
			.form-control.not-editable(v-if='showNotEditable'): span.input-text {{ value }}
			.input-group-btn
				button.btn.btn-default(v-on:click='show_edit = true')
					span.fa.fa-pencil
					span.m-l-xs(v-if='editText') {{ editText }}
	.form-group(v-else)
		label(v-if='label') {{ label }}
		.input-group
			input.form-control(type='text', v-model='input_value')
			.input-group-btn
				button.btn.btn-default(v-on:click='show_edit = false')
					span.fa.fa-close
				button.btn.btn-primary(v-on:click='update')
					span.fa.fa-save
</template>

<style>
.not-editable{
	background: linear-gradient(#ffffff,#d2d1d1);
}
</style>

<script>
export default {
	props:{
		value:{
			type: [String, Number]
		},
		label:String,
		fieldName: String,
		editText: String,
		showNotEditable:{
			type: Boolean,
			default: true
		}
	},
	name: 'EditableFlied',
	data: function(){
		return {
			loading: true,
			errors: {},
			error_message: null,
			input_value: this.value,
			show_edit: false
		};
	},
	watch:{
		value:function(val){
			this.input_value = val;
		}
	},
	methods:{
		update: function(){
			this.$emit('update', { newValue:this.input_value, fieldName:this.fieldName, caller:this });
		},
		updateFail: function(message){
			this.error_message =  message;
		},
		updateSuccess: function(){
			this.show_edit = false;
		}
	}
}
</script>
