'use strict';

const {Modal, app} = require('easyone-electron');
const {dialog} = require('electron').remote;

function roundDecimals(num){
	return Math.round(num * 100) / 100;
}

module.exports = class NewInvoiceItem extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(){
		this.addDOMListener('onSubmit', this.create.bind(this));
		this.on('rendered', this.addOnChanges.bind(this));
	}

	addOnChanges(){
		this.priceInput = this.HTMLElement.querySelector('[name="price"]');
		this.priceTotInput = this.HTMLElement.querySelector('[name="total-price"]');
		this.quantityInput = this.HTMLElement.querySelector('[name="quantity"]');
		this.ivaInput = this.HTMLElement.querySelector('[name="iva"]');
		this.priceInput.addEventListener('input', this.calcTot.bind(this), true);
		this.quantityInput.addEventListener('input', this.calcTot.bind(this), true);
		this.priceTotInput.addEventListener('input', this.calcPrice.bind(this), true);
	}

	calcTot(){
		try{
			let price = Number(this.priceInput.value.replace(',','.'));
			let qty = Number(this.quantityInput.value);
			let iva = Number(this.ivaInput.value);
			let imponibile = roundDecimals(price * qty);
			let imposta = roundDecimals(imponibile * iva / 100);
			let tot = roundDecimals(imponibile + imposta);
			this.priceTotInput.value = tot;
			this.priceTotInput.setCustomValidity('');
		}catch(e){
			this.priceInput.value = '';
		}
	}

	calcPrice(){
		try{
			let priceTot = roundDecimals(Number(this.priceTotInput.value.replace(',','.')));
			let qty = Number(this.quantityInput.value);
			let iva = Number(this.ivaInput.value);
			let imponibile = roundDecimals(priceTot / (1 + (iva/100)));
			let imposta = roundDecimals(imponibile * iva / 100);
			if (roundDecimals(imponibile + imposta) != priceTot){
				this.priceTotInput.setCustomValidity('L\'importo inserito non può generare un corretto, prova ad aumentare o diminuice di un decimale.');
				this.priceInput.value = '';
				return;
			}else{
				this.priceTotInput.setCustomValidity('');
			}
			let price = roundDecimals(imponibile / qty);
			this.priceInput.value = price;
		}catch(e){
			this.priceInput.value = '';
		}
	}

	create(){
		let form = this.HTMLElement.querySelector('#invoiceItemForm');
		if(!form.checkValidate()){
			dialog.showErrorBox('Attenzione', 'Alcuni campi contengono un errore o non sono stati compilati.');
			console.log('dialog');
			return;
		}
		let elements = form.elements;
		function getStrValue(name){
			try{
				return form.elements[name].value.trim();
			}catch(e){
				return undefined;
			}
		}
		function getNumericValue(name){
			try{
				return Numeric(form.elements[name].value.replace(',','.'));
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

		let result = app.getCollections('Invoices').validateItem(newInvoiceItem);
		if(result.valid == true){
			this._modal_result = newInvoiceItem;
			this.close();
		}else{
			alert(result.error.message);
		}
	}
}
