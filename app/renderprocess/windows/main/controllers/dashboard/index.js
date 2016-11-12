'use strict';

module.exports = function DashHome(app, controller){

	controller.useDefaultPaths(__dirname);
	controller.setView(' ');

	controller.addChild('companies-list', '_parent', 'companiesList');
	controller.addChild('invoices-list', '_parent', 'invoicesList');
}
