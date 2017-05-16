'use strict';

const {ipcRenderer, remote} = require('electron');

export default {
	name: 'invoiceA4App',
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
	},
	computed:{
		payMethodString: function(){
			if(this.invoice.payMethod == 0){
				return 'Rimessa Diretta';
			}else if(this.invoice.payMethod == 1){
				return 'Bonifico';
			}
		}
	}
}
