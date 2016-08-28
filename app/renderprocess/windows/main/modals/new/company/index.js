'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class NewCompany extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(){
		this.addDOMListener('onSubmit', this.create.bind(this));
	}

	create(){
		let form = this.querySelector('#companyForm');
		let elements = form.elements;
		function getValue(name){
			try{
				return form.elements[name].value;
			}catch(e){
				return undefined;
			}
		}

		let newCompany = {
			addresses: [],
			phones: []
		};

		newCompany.name = getValue('name');
		newCompany.piva = getValue('piva');
		newCompany.fiscalCode = getValue('fiscalcode');

		newCompany.addresses.push({
			city: getValue('city'),
			street: getValue('street'),
			number: getValue('number'),
			postalCode: getValue('postalcode'),
			nation: getValue('nation')
		});

		newCompany.phones.push({
			number: getValue('phone')
		});
		try{
			newCompany = app.getCollections('Companies').insert(newCompany);
		}catch(e){
			alert(e);
			return;
		}
		this._modal_result = newCompany;
		this.close();
	}
}
