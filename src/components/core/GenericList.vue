<template lang='pug'>
	div
		spinner(v-if='loading')
		slot(:items='items', v-if='!loading')
		.list-footer.clearfix(v-if='showFooter && !loading')
			button.btn.btn-default.pull-left(v-if='canPrev', v-on:click='prev'): i.fa.fa-chevron-left
			button.btn.btn-default.pull-right(v-if='canNext', v-on:click='next'): i.fa.fa-chevron-right
</template>

<script>
export default {
	props: {
		driverMethod: String,
		driverOptions: Object,
		showFooter: {
			type: Boolean,
			default: true
		}
	},
	name: 'GenericList',
	mounted(){
		this.loadItems();
	},
	data () {
		return {
			loading: false,
			items: [],
			error: null,
			pagination:{
				isLast: true,
				currentPage: 1,
				totalItems: 0,
				itemsPerPage: 20
			}
		}
	},
	computed:{
		canNext: function(){
			return !this.pagination.isLast;
		},
		canPrev: function(){
			return this.pagination.currentPage > 1;
		}
	},
	watch:{
		driverOptions:{
			deep: true,
			handler: function(val){
				this.loadItems();
			}
		}
	},
	methods:{
		loadItems(){
			this.loading = true;
			this.error = null;
			mainStore.state.dbDriver[this.driverMethod](Object.assign({
				page: this.pagination.currentPage,
				itemsPerPage: this.pagination.itemsPerPage
			}, this.driverOptions)).then(response => {
				if(!response || !response.data || !response.data.items) throw new Error('Invalid data.');
				this.items = response.data.items;
				this.pagination = response.data.pagination;
			}).catch(e =>{
				if(e && e.message){
					this.error = e.message;
				}
			}).then(()=>{
				this.loading = false;
			});
		},
		next(){
			if(!this.canNext) return;
			this.pagination.currentPage = this.pagination.currentPage + 1;
			this.loadItems();
		},
		prev(){
			if(!this.canPrev) return;
			this.pagination.currentPage = this.pagination.currentPage - 1;
			this.loadItems();
		}
	}
}
</script>
