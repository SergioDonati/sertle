'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class NewInvoiceItem extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(){
		this.addDOMListener('onSubmit', this.create.bind(this));
	}

	create(){
		let form = this.HTMLElement.querySelector('#invoiceItemForm');
		let elements = form.elements;
		function getValue(name){
			try{
				return form.elements[name].value;
			}catch(e){
				return undefined;
			}
		}

		let newInvoiceItem = {
			description: getValue('description'),
			name: getValue('name'),
			code: getValue('code'),
			unit: getValue('unit'),
			price: getValue('price'),
			quantity: getValue('quantity'),
			iva: getValue('iva'),
			discount: getValue('discount')
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
