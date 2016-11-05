'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class GeneralInfo extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	//get stylePath(){ return __dirname+'\\style.less'; }

	init(){
		this.addDOMListener('onPayMethodChange', this.toogleBankSection.bind(this));
		this.addRenderLocals('user', app.getProperty('user'));
		this.on('rendered', function(){
			this.dateInput = this.HTMLElement.querySelector('#invoiceDate');
			this.numberInput = this.HTMLElement.querySelector('#progressiveNumber');
			this.paymethodSelect = this.HTMLElement.querySelector('#paymethod');

			this.dateInput.valueAsDate = new Date();
			this.numberInput.value = app.getCollections('Invoices').getNextProgressiveNumber(app.getProperty('user'));
		});
	}

	toogleBankSection(){
		let bankSection = this.HTMLElement.querySelector('#bankSection');

		if(this.paymethodSelect.value == 1){
			bankSection.style.display = 'inherit';
		}else{
			bankSection.style.display = 'none';
		}
	}

	getData(){
		let data = {};
		data.date = this.dateInput.valueAsDate;
		data.progressiveNumber = this.numberInput.valueAsNumber;
		data.paymethod = this.paymethodSelect.value;
		if(data.paymethod == 1){
			data.iban = this.HTMLElement.querySelector('#invoiceIBAN').value;
			data.bankName = this.HTMLElement.querySelector('#invoiceBankName').value;
		}
		return data;
	}

};
