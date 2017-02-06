<template>
	<header id="main-header">
		<div id="brand">
			<img src="./../../app/resources/icon.ico"/>
			<span class="brand-name">Sertle</span>
		</div>
		<nav>
			<a href="#dashboard" class="active">Dashboard</a>
			<a href="#account">Account</a>
			<a href="#info">Info</a>
		</nav>
		<div id="window-btns">
			<a id="window-min-btn"><span class="fa fa-minus"></span></a>
			<a id="window-max-btn"><span class="fa fa-expand"></span></a>
			<a id="window-close-btn"><span class="fa fa-close"></span></a>
		</div>
	</header>
</template>

<script>
export default {
	name: 'NavigationHeader',
	data () {
		return {

		}
	}
}
</script>
