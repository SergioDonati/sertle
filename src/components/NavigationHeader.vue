<template lang='pug'>
	header#main-header
		#brand
			img(src="./../../app/resources/icon.ico")
			span.brand-name Sertle
		nav
			router-link(to='/home', active-class='active') Dashboard
			router-link(to='/account', active-class='active') Account
			a(href='#', v-on:click='openInfoWindow') Info
		#window-btns
			a#window-min-btn(v-on:click='min'): span.fa.fa-minus
			a#window-max-btn(v-on:click='max'): span.fa.fa-expand
			a#window-close-btn(v-on:click='close'): span.fa.fa-close
</template>

<script>
const {ipcRenderer, remote} = require('electron');
export default {
	name: 'NavigationHeader',
	data () {
		return {

		}
	},
	methods:{
		min: function(){
			const window = remote.getCurrentWindow();
			window.minimize();
		},
		max: function(){
			const window = remote.getCurrentWindow();
	 		if (!window.isMaximized()) {
	 			window.maximize();
	 		} else {
	 			window.unmaximize();
	 		}
		},
		close: function(){
			const window = remote.getCurrentWindow();
			window.close();
		},
		openInfoWindow: function(){
			ipcRenderer.send('info-window');
		}
	}
}
</script>
