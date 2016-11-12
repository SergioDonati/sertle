'use strict';

module.exports = function DeleteInvoice(app, modal, invoice){

	modal.invoice = invoice;
	modal.addRenderLocals('invoice', invoice);

	modal.addDOMListener('logicalDelete', () => {
		app.getCollections('Invoices').logicalDelete(modal.invoice);
		app.controllerManager.startNew('dashboard');
		modal.close(true);
	});

	modal.addDOMListener('hardDelete', () => {
		app.getCollections('Invoices').hardDelete(modal.invoice);
		app.controllerManager.startNew('dashboard');
		modal.close(true);
	});

	modal.addDOMListener('cancel', () => {
		modal.close(false);
		modal.remove();
	});
}
