<template lang="pug">
	.form-group
		.input-group
			span.input-group-addon(v-if='label') {{label}}
			slot(name="before-form-control")
				.input-group-addon(v-if="beforeAddonText") {{beforeAddonText}}
			select.form-control(:placeholder='placeholder', :autofocus='autofocus', :value='value', v-on:input='change($event)' )
				option(v-for="option in options", :value="option.value||option") {{typeof(option)=="string"?option:option.label}}
			slot(name="after-form-control")
				.input-group-addon(v-if="afterAddonText") {{afterAddonText}}
</template>

<script>
	export default{
		props:{
			label:{ type: String},
			placeholder: { type: String },
			autofocus: { type:Boolean },
			value: { type:Object },
			options: {type:Array},
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
