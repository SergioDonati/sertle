'use strict';

module.exports = function EditAddress(app, modal, company, addressIndex){

	if(company.addresses.length>0 && addressIndex >= 0 && addressIndex < company.addresses.length){
		modal.addRenderLocals('address', company.addresses[addressIndex]);
	}else{
		addressIndex = null;
	}

	modal.on('rendered', function(){
		try{
			const input = modal.querySelector('#addressForm input');
			input.focus();
			input.select();
		}catch(e){}
	});

	modal.addDOMListener('onSubmit', () => {
		try{
			const form = modal.querySelector('#addressForm');
			const newAddress = {
				street: form.elements['street'].value,
				number: form.elements['number'].value,
				postalCode: form.elements['postalCode'].value,
				city: form.elements['city'].value,
				nation: form.elements['nation'].value
			};
			if(addressIndex){
				company.addresses[addressIndex] = newAddress;
			}else{
				company.addresses.push(newAddress);
			}
			app.getCollections("Companies").update(company);
			modal.close(true);
		}catch(e){
			alert(e.message);
		}
	});
}
