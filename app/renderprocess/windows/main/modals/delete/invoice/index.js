'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class NewCompany extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(invoice){
		this.addDOMListener('logicalDelete', this.logicalDelete.bind(this));
		this.addDOMListener('hardDelete', this.hardDelete.bind(this));
		this.addDOMListener('cancel', this.cancel.bind(this));
		this.invoice = invoice;
		this.addRenderLocals('invoice', invoice);
	}

	logicalDelete(){
		app.getCollections('Invoices').logicalDelete(this.invoice);
		app.controllerManager.startNew('dashboard');
		this.close();
	}

	hardDelete(){
		app.getCollections('Invoices').hardDelete(this.invoice);
		app.controllerManager.startNew('dashboard');
		this.close();
	}

	cancel(){
		this.close();
		this.remove();
	}
}
