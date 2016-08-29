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
		this.company = app.getCollections('Companies').get(companyId);
		this.addRenderLocals('company', this.company);
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
				self.company = app.getCollections('Companies').get(self.company.$loki);
				self.addRenderLocals('company', self.company);
				self.refresh(null, true);
			});
		});
	}
};
