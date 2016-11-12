'use strict';

module.exports = function DeletePhone(app, modal, user, phoneIndex){
	modal.user = user;
	modal.phoneIndex = phoneIndex;
	modal.addRenderLocals('phone', user.company.phones[phoneIndex]);

	modal.addDOMListener('delete', () => {
		modal.user.company.phones.splice(modal.phoneIndex, 1);
		app.getCollections('Companies').update(modal.company);
		modal.user = app.updateUser(modal.user);
		modal.close(true);
		modal.remove();
	});

	modal.addDOMListener('cancel', () => {
		modal.close(false);
		modal.remove();
	});
}
