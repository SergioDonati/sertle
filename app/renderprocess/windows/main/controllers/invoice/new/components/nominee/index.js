'use strict';

module.exports = function Nominee(app, component) {

	let company = null;

	function setSpanContent(selector, value){
		try{
			component.querySelector(selector).innerHTML = value;
		}catch(e){
			console.log(e.stack);
		}
	}

	function setCompany(newCompany){
		if(!newCompany) return;
		company = newCompany;
		setSpanContent('#nominee-name', company.name);
		if(company.piva) setSpanContent('#nominee-piva', company.piva);
		if(company.fiscalCode) setSpanContent('#nominee-fiscalcode', company.fiscalCode);

		if(company.addresses && company.addresses.length>0){
			const address = company.addresses[0];
			setSpanContent('#nominee-address', address.street + ', ' + address.number + ' <br\>'+ address.postalCode + ', ' + address.city );
		}

		if(company.phones && company.phones.length>0){
			setSpanContent('#nominee-phone', company.phones[0].number);
		}
	}

	component.getCompany = function(){
		return company;
	};

	component.addDOMListener('newCompany', () => {
		app.modalManager.startNew('new/company').then(function(modal){
			modal.on('modalClosed', function(){
				const company = modal.result;
				if(company) setCompany(company);
			});
		});
	});

	component.addDOMListener('searchCompany', () => {
		app.modalManager.startNew('search/company').then(function(modal){
			modal.on('modalClosed', function(){
				const company = modal.result;
				if(company) setCompany(company);
			});
		});
	});
};
