'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class DeleteCompany extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(company){
		this.addDOMListener('delete', this.delete.bind(this));
		this.addDOMListener('cancel', this.cancel.bind(this));
		this.company = company;
		this.addRenderLocals('company', company);
	}

	delete(){
		app.getCollections('Companies').delete(this.company);
		this.close(true);
		this.remove();
	}

	cancel(){
		this.close(false);
		this.remove();
	}
}
