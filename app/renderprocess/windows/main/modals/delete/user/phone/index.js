'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class DeletePhone extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(user, phoneIndex){
		this.addDOMListener('delete', this.delete.bind(this));
		this.addDOMListener('cancel', this.cancel.bind(this));
		this.user = user;
		this.phoneIndex = phoneIndex;
		this.addRenderLocals('phone', user.company.phones[phoneIndex]);
	}

	delete(){
		this.user.company.phones.splice(this.phoneIndex, 1);
		app.getCollections('Companies').update(this.company);
		this.user = app.updateUser(this.user);
		this.close(true);
		this.remove();
	}

	cancel(){
		this.close(false);
		this.remove();
	}
}
