'use script';

const {Component, app} = require('easyone-electron');

module.exports = class InvoicesItemList extends Component {

	get viewPath(){ return __dirname+'\\list.pug'; }

	setInvoices(invoices){
		this.renderArgs.locals.invoices = invoices;
		if(this.rendered) this.refresh(null, true);
	}

	init(){
		this.addDOMListener('openInvoice', this.openInvoice.bind(this));
	}

	openInvoice(event, element){
		let invoiceId = element.getAttribute('data-invoice-id');
		app.controllerManager.startNew('invoice/read', invoiceId);
	}

};
