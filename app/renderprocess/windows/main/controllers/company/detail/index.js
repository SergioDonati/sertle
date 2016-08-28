'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class CompanyDetail extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }
	get componentsPath(){ return __dirname+'\\components'; }

	init(companyId){
		this.addDOMListener('deleteCompany', this.deleteInvoice.bind(this));
		this.company = app.getCollections('Companies').get(companyId);
		this.renderArgs.locals.company = this.company;
	}

	clearActiveNavLink(){
		let nav = this.querySelector('#tab-nav');
		let items = nav.querySelectorAll('li');
		for(let i=0;i<items.length;i++){
			let item = items[i];
			item.classList.remove('active');
		}
	}

	showTab(name, linkElement){
		this.clearActiveNavLink();
		if(linkElement) linkElement.parentNode.classList.add('active');
		let checkInvoiceElement = this.querySelector('#check-tab');
		let compileInvoiceElement = this.querySelector('#compile-tab');
		if(name=='check'){
			checkInvoiceElement.style.display = 'inherit';
			compileInvoiceElement.style.display = 'none';
		}else{
			checkInvoiceElement.style.display = 'none';
			compileInvoiceElement.style.display = 'inherit';
		}
	}

	deleteInvoice(){
		app.modalManager.startNew('delete/invoice', this.invoice);
	}
};
