'use script';

const {Component, app} = require('easyone-electron');

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

module.exports = class AccountCompany extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get componentsPath(){ return __dirname; }

	init(){
		let user = app.getProperty('user');
		if(!user) return;
		this.user = user;
		this.addRenderLocals('user', this.user);

		this.addDOMListener('editField', this.editField.bind(this));

		this.addDOMListener('addAddress', this.addAddress.bind(this));
		this.addDOMListener('removeAddress', this.removeAddress.bind(this));
		this.addDOMListener('editAddress', this.editAddress.bind(this));

		this.addDOMListener('addPhone', this.addPhone.bind(this));
		this.addDOMListener('removePhone', this.removePhone.bind(this));
		this.addDOMListener('editPhone', this.editPhone.bind(this));

	}

	update(){
		this.addRenderLocals('user', this.user);
		this.refresh(null, true);
	}

	addAddress(){
		let self = this;
		app.modalManager.startNew('edit/user/address', this.user).then(function(modal){
			modal.once('result', function(result){
				if(result) {
					self.user = modal.user;
					self.update();
				}
			});
		});
	}

	editAddress(event, element){
		let self = this;
		let index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('edit/user/address', this.user, index).then(function(modal){
			modal.once('result', function(result){
				if(result) {
					self.user = modal.user;
					self.update();
				}
			});
		});
	}

	removeAddress(event, element){
		let self = this;
		let index = element.getAttribute('data-address-idx');
		app.modalManager.startNew('delete/user/address', this.user, index).then(function(modal){
			modal.once('result', function(result){
				if(result) {
					self.user = modal.user;
					self.update();
				}
			});
		});
	}

	addPhone(){
		let self = this;
		app.modalManager.startNew('edit/user/phone', this.user).then(function(modal){
			modal.once('result', function(result){
				if(result) {
					self.user = modal.user;
					self.update();
				}
			});
		});
	}

	editPhone(event, element){
		let self = this;
		let index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('edit/user/phone', this.user, index).then(function(modal){
			modal.once('result', function(result){
				if(result) {
					self.user = modal.user;
					self.update();
				}
			});
		});
	}

	removePhone(event, element){
		let self = this;
		let index = element.getAttribute('data-phone-idx');
		app.modalManager.startNew('delete/user/phone', this.user, index).then(function(modal){
			modal.once('result', function(result){
				if(result) {
					self.user = modal.user;
					self.update();
				}
			});
		});
	}

	editField(event, element){
		let fieldName = element.getAttribute('data-field-name');
		let editOption = editOptions[fieldName];
		editOption.oldValue = this.user.company[fieldName];
		let self = this;
		app.modalManager.startNew('edit/field', editOption).then(function(modal){
			modal.once('result', function(result){
				if(!result) return;
				self.user.company[fieldName] = result;
				self.user = app.updateUser(self.user);
				self.update();
			});
		});
	}

};
