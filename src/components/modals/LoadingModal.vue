<template lang="pug">
	strapmodal(:open="open", :parent_loading='true')
</template>

<script>
	const initialData = {
		loading: false,
	};
	export default {
		props:{ initialOpen:{ type: Boolean, default: false} },
		data: function(){
			return { open: this.initialOpen };
		},
		mounted: function(){
			eventHub.$on('openLoadingModal', () => {
				this.show();
			});
			eventHub.$on('closeLoadingModal', () => {
				this.cancel();
			});
		},
		methods:{
			show: function(title, text){
				return this.open = true;
			},
			cancel: function(){
				this.open = false;
			}
		}
	}
</script>
