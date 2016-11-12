'use script';

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
};

let user = null;

module.exports = function AccountCompany(app, component) {

	user = app.getProperty('user');
	if(user){
		component.addRenderLocals('user', user);
	}

	function update(){
		component.addRenderLocals('user', user);
		component.refresh(null, true);
	}

	component.addDOMListener('addAddress', () => {
		app.modalManager.startNew('edit/user/address', user)
		.then(function(modal){
			modal.once('result', function(result){
				if(result) {
					user = modal.user;
					update();
				}
			});
		});
	});

	component.addDOMListener('editAddress', (event, element) => {
		const index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('edit/user/address', user, index)
		.then(function(modal){
			modal.once('result', function(result){
				if(result) {
					user = modal.user;
					update();
				}
			});
		});
	});

	component.addDOMListener('removeAddress', (event, element) => {
		const index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('delete/user/address', user, index)
		.then(function(modal){
			modal.once('result', function(result){
				if(result) {
					user = modal.user;
					update();
				}
			});
		});
	});

	component.addDOMListener('addPhone', () => {
		app.modalManager.startNew('edit/user/phone', user)
		.then(function(modal){
			modal.once('result', function(result){
				if(result) {
					user = modal.user;
					update();
				}
			});
		});
	});

	component.addDOMListener('editPhone', (event, element) => {
		const index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('edit/user/phone', user, index)
		.then(function(modal){
			modal.once('result', function(result){
				if(result) {
					user = modal.user;
					update();
				}
			});
		});
	});

	component.addDOMListener('removePhone', (event, element) => {
		const index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('delete/user/phone', user, index)
		.then(function(modal){
			modal.once('result', function(result){
				if(result) {
					user = modal.user;
					update();
				}
			});
		});
	});

	component.addDOMListener('editField', (event, element) => {
		const fieldName = element.getAttribute('data-field-name');
		const editOption = editOptions[fieldName];
		editOption.oldValue = user.company[fieldName];
		app.modalManager.startNew('edit/field', editOption)
		.then(function(modal){
			modal.once('result', function(result){
				if(!result) return;
				user.company[fieldName] = result;
				user = app.updateUser(user);
				update();
			});
		});
	});

};
