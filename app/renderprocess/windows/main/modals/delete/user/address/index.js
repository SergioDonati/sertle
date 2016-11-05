'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class DeleteAddress extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(user, addressIndex){
		this.addDOMListener('delete', this.delete.bind(this));
		this.addDOMListener('cancel', this.cancel.bind(this));
		this.user = user;
		this.addressIndex = addressIndex;
		this.addRenderLocals('address', user.company.addresses[addressIndex]);
	}

	delete(){
		this.user.company.addresses.splice(this.addressIndex, 1);
		this.user = app.updateUser(this.user);
		this.close(true);
		this.remove();
	}

	cancel(){
		this.close(false);
		this.remove();
	}
}
