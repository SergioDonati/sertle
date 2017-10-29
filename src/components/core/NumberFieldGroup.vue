<template lang="pug">
	.form-group
		.input-group
			span.input-group-addon(v-if='label') {{label}}
			slot(name="before-form-control")
				.input-group-addon(v-if="beforeAddonText") {{beforeAddonText}}
			input.form-control(type='number', :placeholder='placeholder', :autofocus='autofocus', :value='value', v-on:input='change($event)' )
			slot(name="after-form-control")
				.input-group-addon(v-if="afterAddonText") {{afterAddonText}}
</template>

<script>
	export default{
		props:{
			label:{ type: String},
			placeholder: { type: String },
			autofocus: { type:Boolean },
			value: { type:Number },
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
