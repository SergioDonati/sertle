'use strict';

module.exports = function DeleteAddress(app, modal, user, addressIndex){
	
	modal.user = user;
	modal.addressIndex = addressIndex;
	modal.addRenderLocals('address', user.company.addresses[addressIndex]);

	modal.addDOMListener('delete', () => {
		modal.user.company.addresses.splice(modal.addressIndex, 1);
		modal.user = app.updateUser(modal.user);
		modal.close(true);
		modal.remove();
	});

	modal.addDOMListener('cancel', () => {
		modal.close(false);
		modal.remove();
	});
}
