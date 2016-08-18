'use script';

const {Component, app} = require('easyone-electron');

module.exports = class InvoicesList extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(){
		this.loadInvoices();
		this.addDOMListener('newInvoice', this.newInvoice.bind(this));
	}

	loadInvoices(){
		var invoices = app.getCollections('Invoices').getAll(app.getProperty('user'));
		this.renderArgs.locals.invoices = invoices;
	}

	newInvoice(){
		app.controllerManager.startNew('invoice/new');
	}

};
