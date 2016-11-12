'use strict';

module.exports = function Issuer(app, component) {

	component.on('rendered', loadUserCompany);

	function setSpanContent(selector, value){
		try{
			component.querySelector(selector).innerHTML = value;
		}catch(e){
			console.log(e.stack);
		}
	}

	function loadUserCompany(){
		const user = app.getProperty('user');
		if(!user) return;
		const company = user.company;
		setSpanContent('#issuer-name', company.name);
		if(company.piva) setSpanContent('#issuer-piva', company.piva);
		if(company.fiscalCode) setSpanContent('#issuer-fiscalcode', company.fiscalCode);

		if(company.addresses && company.addresses.length>0){
			const address = company.addresses[0];
			setSpanContent('#issuer-address', address.street + ', ' + address.number + ' <br\>'+ address.postalCode + ', ' + address.city );
		}

		if(company.phones && company.phones.length>0){
			setSpanContent('#issuer-phone', company.phones[0].number);
		}
	}

};
