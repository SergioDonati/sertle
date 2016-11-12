'use script';

module.exports = function InvoicesItemList(app, component) {
	component.setRelativeViewPath('../list.pug');

	component.setInvoices = (invoices) => {
		component.addRenderLocals('invoices', invoices);
		if(component.rendered) component.refresh(null, true);
	}

	component.addDOMListener('openInvoice', (event, element) => {
		const invoiceId = element.getAttribute('data-invoice-id');
		app.controllerManager.startNew('invoice/read', invoiceId);
	});

};
