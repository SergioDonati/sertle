'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class DeleteAddress extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(company, addressIndex){
		this.addDOMListener('delete', this.delete.bind(this));
		this.addDOMListener('cancel', this.cancel.bind(this));
		this.company = company;
		this.addressIndex = addressIndex;
		this.addRenderLocals('address', company.addresses[addressIndex]);
	}

	delete(){
		this.company.addresses.splice(this.addressIndex, 1);
		app.getCollections('Companies').update(this.company);
		this.close(true);
		this.remove();
	}

	cancel(){
		this.close(false);
		this.remove();
	}
}
