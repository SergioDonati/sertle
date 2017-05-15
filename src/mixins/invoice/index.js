'use strict';

module.exports.methods = {
	getInvoiceNumber(invoice){
		try{
			const year = String((new Date(invoice.date)).getFullYear()).slice(2,4);
			return invoice.progressiveNumber+'/'+year;
		}catch(e){
			console.error(e);
		}
		return invoice.progressiveNumber;
	}
}
