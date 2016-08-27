'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class Issuer extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(){
		this.on('rendered', this.loadUserCompany.bind(this));
	}

	_setSpanContent(selector, value){
		try{
			this.HTMLElement.querySelector(selector).innerHTML = value;
		}catch(e){
			console.log(e.stack);
		}
	}

	loadUserCompany(){
		let user = app.getProperty('user');
		if(!user) return;
		this.user = user;
		let company = user.company;
		this._setSpanContent('#issuer-name', company.name);
		if(company.piva) this._setSpanContent('#issuer-piva', company.piva);
		if(company.fiscalCode) this._setSpanContent('#issuer-fiscalcode', company.fiscalCode);

		if(company.addresses && company.addresses.length>0){
			let address = company.addresses[0];
			this._setSpanContent('#issuer-address', address.street + ', ' + address.number + ' <br\>'+ address.postalCode + ', ' + address.city );
		}

		if(company.phones && company.phones.length>0){
			this._setSpanContent('#issuer-phone', company.phones[0].number);
		}
	}

};
