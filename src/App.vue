<template lang="pug">
	#app
		navigation-header
		#app-container.container-fluid
			transition(name="custom-classes-transition" enter-active-class="animated tada" leave-active-class="animated bounceOutRight")
				router-view(transition="fade" transition-mode="out-in" class="animated")
</template>

<style lang='less' src='./style/app.less'></style>
<style lang='less' src='./style/main.less'></style>

<script>
	import NavigationHeader from './components/NavigationHeader.vue';

	export default {
		name: 'app',
		components: {
			navigationHeader: NavigationHeader
		},
		data () {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		}
	}
</script>
