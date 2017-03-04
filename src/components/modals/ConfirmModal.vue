<template lang="pug">
	strapmodal(:open="open", :parent_loading='loading', v-on:close="cancel", v-on:ok="ok", :modal_title="title", :ok_icon='"fa-check"', :ok_message="ok_message", :close_message='cancel_message')
		p {{ text }}
</template>

<script>
	const initialData = {
		loading: false,
		text: null,
		title: 'Conferma',
		ok_message: 'Si',
		cancel_message: 'No'
	};
	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		data: function(){
			return Object.assign({ open: this.initialOpen }, initialData);
		},
		mounted: function(){
			eventHub.$on('openConfirmModal', (title, text) => {
				this.show(title, text);
			});
		},
		methods:{
			reset: function(){
				Object.assign(this.$data, initialData);
			},
			show: function(title, text){
				this.showWithOptions({
					title: title,
					text: text
				});
				return this;
			},
			showWithOptions: function(options){
				if(this.open){
					console.warn('ConfirmModal già aperto, chiudilo prima.');
					return;
				}
				this.reset();
				if(options.ok_message) this.ok_message = options.ok_message;
				if(options.cancel_message) this.cancel_message = options.cancel_message;
				if(options.title) this.title = options.title;
				if(options.text) this.text = options.text;
				this.open = true;
				return this;
			},
			ok: function(){
				this.open = false;
				this.$off('cancel');
				this.$emit('ok');
			},
			cancel: function(){
				this.open = false;
				this.$off('ok');
				this.$emit('cancel');
			}
		}
	}
</script>
