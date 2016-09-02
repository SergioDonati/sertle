'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class DeletePhone extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(company, phoneIndex){
		this.addDOMListener('delete', this.delete.bind(this));
		this.addDOMListener('cancel', this.cancel.bind(this));
		this.company = company;
		this.phoneIndex = phoneIndex;
		this.addRenderLocals('phone', company.phones[phoneIndex]);
	}

	delete(){
		this.company.phones.splice(this.phoneIndex, 1);
		app.getCollections('Companies').update(this.company);
		this.close(true);
		this.remove();
	}

	cancel(){
		this.close(false);
		this.remove();
	}
}
