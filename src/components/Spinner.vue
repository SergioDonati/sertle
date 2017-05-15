<template lang='pug'>
	.double-bounce-spinner(v-if='type == "double-bounce"')
		.double-bounce1
		.double-bounce2
	.circle-spinner(v-else-if='type == "circle-spinner"')
</template>

<style scoped>
.double-bounce-spinner {
	width: 40px;
	height: 40px;

	position: relative;
	margin: 100px auto;
}

.double-bounce1, .double-bounce2 {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #333;
	opacity: 0.6;
	position: absolute;
	top: 0;
	left: 0;

	-webkit-animation: sk-bounce 2.0s infinite ease-in-out;
	animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
	-webkit-animation-delay: -1.0s;
	animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
	0%, 100% { -webkit-transform: scale(0.0) }
	50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
	0%, 100% {
		transform: scale(0.0);
		-webkit-transform: scale(0.0);
	} 50% {
		transform: scale(1.0);
		-webkit-transform: scale(1.0);
	}
}

.circle-spinner {
	border: 16px solid #f3f3f3; /* Light grey */
	border-top: 16px solid #3498db; /* Blue */
	border-radius: 50%;
	width: 120px;
	height: 120px;
	animation: spin-rotate 2s linear infinite;
}

@keyframes spin-rotate {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>

<script>
export default {
	props:{
		type:{
			type: String,
			default: 'double-bounce'
		}
	},
	name: 'Spinner'
}
</script>
