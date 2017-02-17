<template lang="pug">
	#sidebar(:class='{ "open": open }')
		.fixed
			.header
				a(v-on:click='open = !open'): i.fa(:class='{ "fa-long-arrow-left":open, "fa-long-arrow-right": !open }')
			.links
				router-link(:to='{ name : "dashboard", path: "/" }', active-class='active')
					i.fa.fa-pie-chart
					span.m-l-xs(v-if='open') Dashboard
				router-link(to='/companies', active-class='active')
					i.fa.fa-users
					span.m-l-xs(v-if='open') Società
				router-link(to='/invoices', active-class='active')
					i.fa.fa-file
					span.m-l-xs(v-if='open') Fatture
</template>

<style lang='less'>
	#sidebar{
		float: left;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-top: 10px;
		padding: 5px;

		flex-direction: column;
		overflow: hidden;
		transition: all 1s;
		height: 100%;
		width: 80px;
		&.open{
			width:200px;
			.header{
				text-align: left;
			}
			.fixed{
				width:200px;
			}
			.links a{
				width: 160px;
			}
		}
		position: relative;
		.fixed{
			position: fixed;
			background: #214e75;
			padding: 5px;
			padding-top: 10px;
			width: 80px;
			transition: all 1s;
			overflow: hidden;
		}
		.header{
			padding: 20px;
			text-align: center;
			a{
				color: white;
				cursor: pointer;
			}
		}
		.links{
			display: flex;
			flex-direction: column;
			align-items: center;
			.fa{
				width:30px;
				text-align: center;
			}
			a{
				text-align: left;
				flex: 1;
				font-size: 1.2em;
				font-size: 25px;
				margin-bottom: 18px;
				text-shadow: 1px 1px 0px black;
				text-decoration: none;
				color: #888;
				&.active, &:hover{
					color:white;
				}
			}
		}
	}
</style>

<script>
	export default {
		name: 'SideBar',
		data () {
			return {
				open: false,
				msg: 'Welcome to Your Vue.js App'
			}
		}
	}
</script>
