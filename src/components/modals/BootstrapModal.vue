<template lang="pug">
	.modal.fade(tabindex="-1", :backdrop="canDismiss?true:'static'", role="dialog", :class="open?'in':''", ref="modal", v-bind:style="{ display: open?'block':'none' }")
		.modal-dialog(role="document", :class="large?'modal-lg':''")
			.modal-content
				.modal-header(v-if="!parent_loading")
					button(type="button" class="close" data-dismiss="modal", v-on:click="close", aria-label="Close")
						span(aria-hidden="true") &times;
					slot(name="header-title")
						h4.modal-title {{ modal_title }}
				.modal-body(v-if="!parent_loading")
					slot {{ modal_body }}
				.modal-body(v-if="parent_loading")
					.loading
						p {{ loading_message }}
						spinner
				.modal-footer(v-if="!parent_loading && show_footer")
					slot(name="footer")
						.btn-group
							button(type="button" class="btn btn-default", v-on:click="close")
								span.fa.fa-close
								span.m-l-xs {{ close_message }}
							button(type="button" class="btn btn-success", v-on:click="ok")
								span.fa(:class='ok_icon')
								span.m-l-xs {{ ok_message }}
</template>

<style scoped>
	.modal{
		background: rgba(62, 62, 62, 0.6);
	}
	.modal .modal-body .loading{
		height:300px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>

<script>
    export default {
		props:{
			show_footer:{
				type: Boolean,
				default: true
			},
			large: {
				type: Boolean,
				default: false
			},
			modal_title:{
				type: String,
				default: ''
			},
			modal_body: {
				type: String,
				default: ''
			},
			close_message: {
				type: String,
				default: 'Chiudi'
			},
			ok_message: {
				type: String,
				default: 'Ok'
			},
			ok_icon: {
				type: String,
				default: 'fa-save'
			},
			loading_message:{
				type: String,
				default: 'Azione in corso, attendere ...'
			},
			eventHandler: 'Object',
			open: Boolean,
			parent_loading:{
				type: Boolean,
				default: false
			},
			dismissable:{
				type: Boolean,
				default: false
			}
		},
		mounted: function(){
			this.strapmodal = this.$el;
		},
		data: function(){
			return {
				strapmodal: null
			};
		},
		computed: {
			canDismiss: function(){
				return this.dismissable;
			}
		},
		methods:{
			ok: function(){
				this.$emit('ok');
			},
			close: function(){
				//this.open = false;
				this.$emit('close');
			}
		}
	}
</script>
