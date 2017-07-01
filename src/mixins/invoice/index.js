'use strict';

const payMethodMap = require('../../commons/payMethodMap');

module.exports.methods = {
	getInvoiceNumber(invoice){
		try{
			const year = String((new Date(invoice.date)).getFullYear()).slice(2,4);
			return invoice.progressiveNumber+'/'+year;
		}catch(e){
			console.error(e);
		}
		return invoice.progressiveNumber;
	},
	payMethodString: function(invoice){
		if(!invoice.payMethod) return '';
		return payMethodMap[invoice.payMethod].label;
	},
	payMethodOptions: function(){
		return payMethodMap;
	}
}
