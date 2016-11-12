'use strict';

module.exports = function DeletePhone(app, modal, company, phoneIndex){

	modal.company = company;
	modal.phoneIndex = phoneIndex;
	modal.addRenderLocals('phone', company.phones[phoneIndex]);

	modal.addDOMListener('delete', () => {
		modal.company.phones.splice(modal.phoneIndex, 1);
		app.getCollections('Companies').update(modal.company);
		modal.close(true);
		modal.remove();
	});

	modal.addDOMListener('cancel', () => {
		modal.close(false);
		modal.remove();
	});
}
