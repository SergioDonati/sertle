'use strict';

const elements = {};

module.exports = function GeneralInfo(app, component) {

	component.addRenderLocals('user', app.getProperty('user'));
	component.on('rendered', function(){
		elements.dateInput = component.querySelector('#invoiceDate');
		elements.numberInput = component.querySelector('#progressiveNumber');
		elements.paymethodSelect = component.querySelector('#paymethod');

		elements.dateInput.valueAsDate = new Date();
		elements.numberInput.value = app.getCollections('Invoices').getNextProgressiveNumber(app.getProperty('user'));
	});

	component.addDOMListener('onPayMethodChange', () => {
		const bankSection = component.querySelector('#bankSection');

		if(elements.paymethodSelect.value == 1){
			bankSection.style.display = 'inherit';
		}else{
			bankSection.style.display = 'none';
		}
	});

	component.getData = () => {
		const data = {};
		data.date = elements.dateInput.valueAsDate;
		data.progressiveNumber = elements.numberInput.valueAsNumber;
		data.paymethod = elements.paymethodSelect.value;
		if(data.paymethod == 1){
			data.iban = component.querySelector('#invoiceIBAN').value;
			data.bankName = component.querySelector('#invoiceBankName').value;
		}
		return data;
	}

};
