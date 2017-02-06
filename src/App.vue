<template lang="pug">
	#app
		navigation-header
		router-view
</template>

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
