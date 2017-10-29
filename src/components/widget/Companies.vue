<template lang="pug">
	.widget.flex-container
		router-link(to='companies'): h5 Società
		p {{ count }}
</template>

<script>
	import driver from '@/DBDriver';

	export default {
		name: 'CompaniesWidget',
		data () {
			return {
				count: 0
			}
		},
		mounted:function(){
			driver.getCompaniesCount().then(response => {
				this.count = response.data;
			});
		}
	}
</script>
