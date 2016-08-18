'use script';

const {Component, app} = require('easyone-electron');

module.exports = class CompaniesList extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(){
		this.loadCompanies();
		this.addDOMListener('newCompany', this.newCompany.bind(this));
	}

	loadCompanies(){
		var companies = app.getCollections('Companies').getAll();
		this.renderArgs.locals.companies = companies;
	}

	newCompany(){
		app.modalManager.startNew('new/company');
	}

};
