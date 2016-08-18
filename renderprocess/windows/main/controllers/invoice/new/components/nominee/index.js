'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class Nominee extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	//get stylePath(){ return __dirname+'\\style.less'; }

	init(){
		this.addDOMListener('newCompany', this.newCompany.bind(this));
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
		this.company = company;
		this._setSpanContent('#nominee-name', company.name);
		this._setSpanContent('#nominee-iva', company.iva);
		this._setSpanContent('#nominee-fiscalcode', company.fiscalCode);
	}

	newCompany(){
		app.modalManager.startNew('new/company');
	}
};
