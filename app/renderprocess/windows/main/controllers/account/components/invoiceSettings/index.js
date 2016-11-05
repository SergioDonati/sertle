'use script';

const {Component, app} = require('easyone-electron');

const editOptions = {
	heading: {
		title: "Modifica Intestazione"
	},
	headerText: {
		title: "Modifica Testo in cima",
		type: 'textarea'
	},
	footerText: {
		title: "Modifica Testo in fondo",
		type: 'textarea'
	},
	defaultIBAN: {
		title: "Modifica IBAN di default"
	},
	defaultBankName: {
		title: "Modifica Nome Banca di default"
	}
}

module.exports = class InvoiceSettings extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get componentsPath(){ return __dirname; }

	init(){
		let user = app.getProperty('user');
		if(!user) return;
		this.user = user;
		this.addRenderLocals('user', this.user);

		this.addDOMListener('editField', this.editField.bind(this));
	}

	update(){
		this.addRenderLocals('user', this.user);
		this.refresh(null, true);
	}

	editField(event, element){
		let fieldName = element.getAttribute('data-field-name');
		let editOption = editOptions[fieldName];
		editOption.oldValue = this.user.invoiceSetting[fieldName];
		let self = this;
		app.modalManager.startNew('edit/field', editOption).then(function(modal){
			modal.once('result', function(result){
				if(!result) return;
				self.user.invoiceSetting[fieldName] = result;
				self.user = app.updateUser(self.user);
				self.update();
			});
		});
	}

};
