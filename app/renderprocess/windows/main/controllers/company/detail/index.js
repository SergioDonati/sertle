'use strict';

const {Controller, app} = require('easyone-electron');

const editOptions = {
	piva: {
		title: "Modifica Partita IVA"
	},
	fiscalCode: {
		title: "Modifica Codice Fiscale"
	},
	name: {
		title: "Modifica Nome"
	}
}

module.exports = class CompanyDetail extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }
	get componentsPath(){ return __dirname+'\\components'; }

	init(companyId){
		this.addDOMListener('deleteCompany', this.deleteCompany.bind(this));
		this.addDOMListener('editField', this.editField.bind(this));

		this.addDOMListener('addAddress', this.addAddress.bind(this));
		this.addDOMListener('removeAddress', this.removeAddress.bind(this));
		this.addDOMListener('editAddress', this.editAddress.bind(this));

		this.addDOMListener('addPhone', this.addPhone.bind(this));
		this.addDOMListener('removePhone', this.removePhone.bind(this));
		this.addDOMListener('editPhone', this.editPhone.bind(this));

		this.company = app.getCollections('Companies').get(companyId);
		this.addRenderLocals('company', this.company);
	}

	update(){
		this.company = app.getCollections('Companies').get(this.company.$loki);
		this.addRenderLocals('company', this.company);
		this.refresh(null, true);
	}

	addAddress(){
		let self = this;
		app.modalManager.startNew('edit/address', this.company).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	}

	editAddress(event, element){
		let self = this;
		let index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('edit/address', this.company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	}

	removeAddress(event, element){
		let self = this;
		let index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('delete/address', this.company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	}

	addPhone(){
		let self = this;
		app.modalManager.startNew('edit/phone', this.company).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	}

	editPhone(event, element){
		let self = this;
		let index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('edit/phone', this.company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	}

	removePhone(event, element){
		let self = this;
		let index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('delete/phone', this.company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	}

	deleteCompany(){
		app.modalManager.startNew('delete/company', this.company).then(function(modal){
			modal.once('result', function(result){
				if(result) app.controllerManager.startNew('dashboard');
			});
		});
	}

	editField(event, element){
		let fieldName = element.getAttribute('data-field-name');
		let editOption = editOptions[fieldName];
		editOption.oldValue = this.company[fieldName];
		let self = this;
		app.modalManager.startNew('edit/field', editOption).then(function(modal){
			modal.once('result', function(result){
				if(!result) return;
				self.company[fieldName] = result;
				app.getCollections('Companies').update(self.company);
				self.update();
			});
		});
	}
};
