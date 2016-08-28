'use script';

const {Component, app} = require('easyone-electron');

module.exports = class CompaniesItemList extends Component {

	get viewPath(){ return __dirname+'\\list.pug'; }

	setCompanies(companies){
		this.renderArgs.locals.companies = companies;
		if(this.rendered) this.refresh(null, true);
	}

	init(){
		this.addDOMListener('openCompany', this.openCompany.bind(this));
	}

	openCompany(event, element){
		let companyID = element.getAttribute('data-company-id');
		app.controllerManager.startNew('company/detail', companyID);
	}
};
