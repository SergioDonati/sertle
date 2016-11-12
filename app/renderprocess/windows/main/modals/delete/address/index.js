'use strict';

module.exports = function DeleteAddress(app, modal, company, addressIndex){

	modal.company = company;
	modal.addressIndex = addressIndex;
	modal.addRenderLocals('address', company.addresses[addressIndex]);

	modal.addDOMListener('delete', () => {
		modal.company.addresses.splice(addressIndex, 1);
		app.getCollections('Companies').update(modal.company);
		modal.close(true);
		modal.remove();
	});

	modal.addDOMListener('cancel', () => {
		modal.close(false);
		modal.remove();
	});
}
