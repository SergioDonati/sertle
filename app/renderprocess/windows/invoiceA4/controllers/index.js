'use strict';

module.exports = function InvoiceTemplate(app, controller) {

	const invoice = JSON.parse(JSON.stringify(app.getProperty('invoice')));
	controller.addRenderLocals('invoice', invoice);
};
