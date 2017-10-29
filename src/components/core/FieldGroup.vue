<template lang="pug">
	.form-group
		.input-group(v-if="type=='text'")
			span.input-group-addon(v-if='label') {{label}}
			slot(name="before-form-control")
				.input-group-addon(v-if="beforeAddonText") {{beforeAddonText}}
			input.form-control(v-if="type=='text'", type='text', :placeholder='placeholder', :autofocus='autofocus', :value='value', v-on:input='change($event)' )
			slot(name="after-form-control")
				.input-group-addon(v-if="afterAddonText") {{afterAddonText}}
</template>

<script>
	export default{
		props:{
			label:{ type: String},
			type: { type: String, default:'text'},
			placeholder: { type: String },
			autofocus: { type:Boolean },
			value: { type:String },
			afterAddonText: { type:String },
			beforeAddonText: { type:String }
		},
		methods:{
			change(event){
				this.$emit('input', event.target.value);
			}
		}
	}
</script>
