'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class Nominee extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	//get stylePath(){ return __dirname+'\\style.less'; }

	init(){
		this.addDOMListener('newCompany', this.newCompany.bind(this));
		this.addDOMListener('searchCompany', this.searchCompany.bind(this));
	}

	_setSpanContent(selector, value){
		try{
			this.HTMLElement.querySelector(selector).innerHTML = value;
		}catch(e){
			console.log(e.stack);
		}
	}

	setCompany(company){
		if(!this.HTMLElement) return;
		if(!company) return;
		this.company = company;
		this._setSpanContent('#nominee-name', company.name);
		this._setSpanContent('#nominee-piva', company.piva);
		this._setSpanContent('#nominee-fiscalcode', company.fiscalCode);

		if(company.addresses && company.addresses.length>0){
			let address = company.addresses[0];
			this._setSpanContent('#nominee-address', address.street + ', ' + address.number + ' <br\>'+ address.postalCode + ', ' + address.city );
		}

		if(company.phones && company.phones.length>0){
			this._setSpanContent('#nominee-phone', company.phones[0].number);
		}
	}

	newCompany(){
		app.modalManager.startNew('new/company').then(function(modal){
			modal.on('modalClosed', function(){
				let company = modal.result;
				if(company) component.setCompany(company);
			});
		});
	}

	searchCompany(){
		let component = this;
		app.modalManager.startNew('search/company').then(function(modal){
			modal.on('modalClosed', function(){
				let company = modal.result;
				if(company) component.setCompany(company);
			});
		});
	}
};
