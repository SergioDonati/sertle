'use strict';

module.exports = function DeleteCompany(app, modal, company){
	modal.company = company;
	modal.addRenderLocals('company', company);

	modal.addDOMListener('delete', () => {
		app.getCollections('Companies').delete(modal.company);
		this.close(true);
		this.remove();
	});

	modal.addDOMListener('cancel', () => {
		modal.close(false);
		modal.remove();
	});
}
