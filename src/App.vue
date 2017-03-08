<template lang="pug">
	#app
		navigation-header
		#app-container
			sidebar(v-if='show_sidebar')
			.container-fluid
				transition(name="custom-classes-transition" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutUp" mode="out-in")
					router-view
</template>

<style lang='less' src='./style/app.less'></style>
<style lang='less' src='./style/main.less'></style>

<script>
	import NavigationHeader from './components/NavigationHeader.vue';
	import Sidebar from './Sidebar.vue';
	export default {
		name: 'app',
		components: {
			navigationHeader: NavigationHeader,
			sidebar: Sidebar
		},
		data () {
			return {
				msg: 'Welcome to Your Vue.js App',
				show_sidebar: true
			}
		},
		mounted: function(){
			eventHub.$on('hideSidebar', () =>{
				this.show_sidebar = false;
			});
			eventHub.$on('showSidebar', () =>{
				this.show_sidebar = true;
			});
		}
	}
</script>
