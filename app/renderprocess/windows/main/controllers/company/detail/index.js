'use strict';

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

module.exports = function CompanyDetail(app, controller, companyId) {

	let company = app.getCollections('Companies').get(companyId);
	controller.addRenderLocals('company', company);

	function update(){
		company = app.getCollections('Companies').get(companyId);
		controller.addRenderLocals('company', company);
		controller.refresh(null, true);
	}

	controller.addDOMListener('addAddress', () => {
		app.modalManager.startNew('edit/address', company).then(function(modal){
			modal.once('result', function(result){
				if(result) update();
			});
		});
	});

	controller.addDOMListener('editAddress', (event, element) => {
		const index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('edit/address', company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) update();
			});
		});
	});

	controller.addDOMListener('removeAddress', (event, element) => {
		const index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('delete/address', this.company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) self.update();
			});
		});
	});

	controller.addDOMListener('addPhone', () => {
		app.modalManager.startNew('edit/phone', company).then(function(modal){
			modal.once('result', function(result){
				if(result) update();
			});
		});
	});

	controller.addDOMListener('editPhone', (event, element) => {
		const index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('edit/phone', company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) update();
			});
		});
	});

	controller.addDOMListener('removePhone', (event, element) => {
		const index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('delete/phone', company, index).then(function(modal){
			modal.once('result', function(result){
				if(result) update();
			});
		});
	});

	controller.addDOMListener('deleteCompany', () => {
		app.modalManager.startNew('delete/company', company).then(function(modal){
			modal.once('result', function(result){
				if(result) app.controllerManager.startNew('dashboard');
			});
		});
	});

	controller.addDOMListener('editField', (event, element) => {
		const fieldName = element.getAttribute('data-field-name');
		const editOption = editOptions[fieldName];
		editOption.oldValue = company[fieldName];
		app.modalManager.startNew('edit/field', editOption).then(function(modal){
			modal.once('result', function(result){
				if(!result) return;
				company[fieldName] = result;
				app.getCollections('Companies').update(company);
				update();
			});
		});
	});
};
