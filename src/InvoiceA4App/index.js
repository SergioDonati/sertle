'use strict';

const {ipcRenderer, remote} = require('electron');

export default {
	name: 'invoiceA4App',
	components: {
	},
	data () {
		return {
			msg: 'Welcome to Your Vue.js App',
			invoice: null
		}
	},
	mounted: function(){
		this.invoice = remote.getCurrentWindow().invoice;
		setTimeout(()=>{
			this.print();
		}, 500);
	},
	methods:{
		print: function(){
			remote.getCurrentWindow().printInvoice();
		}
	}
}
