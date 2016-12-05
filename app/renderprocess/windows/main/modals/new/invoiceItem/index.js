'use strict';

const {dialog} = require('electron').remote;

function roundDecimals(num){
	return Math.round(num * 100) / 100;
}

module.exports = function NewInvoiceItem(app, modal){
	const elements = {};

	modal.on('rendered', () => {
		elements.priceInput = modal.querySelector('[name="price"]');
		elements.priceTotInput = modal.querySelector('[name="total-price"]');
		elements.quantityInput = modal.querySelector('[name="quantity"]');
		elements.ivaInput = modal.querySelector('[name="iva"]');

		elements.priceInput.addEventListener('input', calcTot, true);
		elements.ivaInput.addEventListener('input', calcTot, true);
		elements.quantityInput.addEventListener('input', calcTot, true);
		elements.priceTotInput.addEventListener('input', calcPrice, true);

		try{
			modal.querySelector('[name="description"]').focus();
		}catch(e){}
	});

	function calcTot(){
		try{
			const price = elements.priceInput.valueAsNumber;
			const qty = elements.quantityInput.valueAsNumber;
			const iva = elements.ivaInput.valueAsNumber;
			const imponibile = roundDecimals(price * qty);
			const imposta = roundDecimals(imponibile * iva / 100);
			const tot = roundDecimals(imponibile + imposta);
			elements.priceTotInput.valueAsNumber = tot;
			elements.priceTotInput.setCustomValidity('');
		}catch(e){
			elements.priceInput.value = '';
		}
	}

	function calcPrice(){
		try{
			const priceTot = roundDecimals(elements.priceTotInput.valueAsNumber);
			const qty = elements.quantityInput.valueAsNumber;
			const iva = elements.ivaInput.valueAsNumber;
			const imponibile = roundDecimals(priceTot / (1 + (iva/100)));
			const imposta = roundDecimals(imponibile * iva / 100);
			if (roundDecimals(imponibile + imposta) != priceTot){
				elements.priceTotInput.setCustomValidity('L\'importo inserito non può generare un prezzo corretto, prova ad aumentare o diminuice di un decimale.');
				elements.priceInput.value = '';
				return;
			}else{
				elements.priceTotInput.setCustomValidity('');
			}
			const price = roundDecimals(imponibile / qty);
			elements.priceInput.valueAsNumber = price;
		}catch(e){
			elements.priceInput.value = '';
		}
	}

	modal.addDOMListener('onSubmit', () => {
		const form = modal.querySelector('#invoiceItemForm');
		if(!form.checkValidity()){
			dialog.showErrorBox('Attenzione', 'Alcuni campi contengono un errore o non sono stati compilati.');
			return;
		}
		function getStrValue(name){
			try{
				return form.elements[name].value.trim();
			}catch(e){
				return undefined;
			}
		}
		function getNumericValue(name){
			try{
				return form.elements[name].valueAsNumber;
			}catch(e){
				return undefined;
			}
		}

		let newInvoiceItem = {
			description: getStrValue('description'),
			name: getStrValue('name'),
			code: getStrValue('code'),
			unit: getStrValue('unit'),
			price: getNumericValue('price'),
			quantity: getNumericValue('quantity'),
			iva: getNumericValue('iva'),
			discount: getNumericValue('discount')
		};

		newInvoiceItem = app.getCollections('Invoices').constructor.calcItem(newInvoiceItem);

		const result = app.getCollections('Invoices').validateItem(newInvoiceItem);
		if(result.valid == true){
			modal.close(newInvoiceItem);
			modal.remove();
		}else{
			alert(result.error.message);
		}
	});
}
