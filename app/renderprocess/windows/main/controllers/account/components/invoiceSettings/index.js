'use script';

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

module.exports = function InvoiceSettings(app, component) {

	let user = app.getProperty('user');
	if(user){
		component.addRenderLocals('user', user);
	}

	function update(){
		component.addRenderLocals('user', user);
		component.refresh(null, true);
	}

	component.addDOMListener('editField', (event, element) => {
		const fieldName = element.getAttribute('data-field-name');
		const editOption = editOptions[fieldName];
		editOption.oldValue = user.invoiceSetting[fieldName];
		app.modalManager.startNew('edit/field', editOption).then(function(modal){
			modal.once('result', function(result){
				if(!result) return;
				user.invoiceSetting[fieldName] = result;
				user = app.updateUser(user);
				update();
			});
		});
	});

};
