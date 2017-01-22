'use strict';

let nameInput = null;
let pivaInput = null;
let fiscalCodeInput = null;
let civicNumberInput = null;
let postalCodeInput = null;
let streesInput = null;
let cityInput = null;
let nationInput = null;
let phoneInput = null;

module.exports = function Login(app, controller) {
	controller.useDefaultPaths(__dirname);

	controller.on('rendered', parent => {
		nameInput = parent.querySelector('#login-form [name="name"]');
		pivaInput = parent.querySelector('#login-form [name="piva"]');
		fiscalCodeInput = parent.querySelector('#login-form [name="fiscalCode"]');
		civicNumberInput = parent.querySelector('#login-form [name="civicNumber"]');
		postalCodeInput = parent.querySelector('#login-form [name="postalCode"]');
		streesInput = parent.querySelector('#login-form [name="street"]');
		cityInput = parent.querySelector('#login-form [name="city"]');
		nationInput = parent.querySelector('#login-form [name="nation"]');
		phoneInput = parent.querySelector('#login-form [name="phone"]');
	});

	controller.addDOMListener('onSubmit', () => {
		const name = nameInput.value.trim();
		const piva = pivaInput.value.trim();
		const fiscalCode = fiscalCodeInput.value.trim();
		const city = cityInput.value.trim();
		const postalCode = postalCodeInput.value.trim();
		const street = streesInput.value.trim();
		const civicNumber = civicNumberInput.value.trim();
		const nation = nationInput.value.trim();
		const phone = phoneInput.value.trim();
		if(name.length == 0){
			alert('La ragione sociale è obbligatoria e non può essere vuota');
			return;
		}
		if(name.length<3){
			alert('La ragione sociale è troppo corta. Almeno 3 caratteri.');
			return;
		}
		app.getCollections('Users').insert({
			username: name,
			default: true,
			company: {
				name: name,
				piva: piva,
				fiscalCode: fiscalCode,
				addresses: [{
					city: city,
					postalCode: postalCode,
					street: street,
					number: civicNumber,
					nation: nation
				}],
				phones: [{
					number: phone
				}]
			},
			invoiceSetting: {}
		});
		const user = app.getCollections('Users').getDefault();
		app.setProperty('user', user);
		app.login(user);
	});

};
