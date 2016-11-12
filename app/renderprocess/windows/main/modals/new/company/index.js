'use strict';

module.exports = function NewCompany(app, modal){

	modal.addDOMListener('onSubmit', () => {
		const form = modal.querySelector('#companyForm');
		function getValue(name){
			try{
				return form.elements[name].value;
			}catch(e){
				return undefined;
			}
		}

		let newCompany = {
			addresses: [],
			phones: []
		};

		newCompany.name = getValue('name');
		newCompany.piva = getValue('piva');
		newCompany.fiscalCode = getValue('fiscalcode');

		newCompany.addresses.push({
			city: getValue('city'),
			street: getValue('street'),
			number: getValue('number'),
			postalCode: getValue('postalcode'),
			nation: getValue('nation')
		});

		const phoneNumber = getValue('phone');
		if(phoneNumber){
			newCompany.phones.push({
				number: phoneNumber
			});
		}
		try{
			newCompany = app.getCollections('Companies').insert(newCompany);
		}catch(e){
			console.error(e.stack);
			alert(e);
			return;
		}
		modal.close(newCompany);
	});
}
