'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class EditPhone extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(user, phoneIndex){
		this.user = user;
		if(user.company.phones.length>0 && phoneIndex>=0 && phoneIndex<user.company.phones.length){
			this.phoneIndex = phoneIndex;
			this.addRenderLocals('phone', user.company.phones[phoneIndex]);
		}
		this.addDOMListener('onSubmit', this.editCheck.bind(this));
		this.on('rendered', function(){
			try{
				let input = this.querySelector('#phoneForm input');
				input.focus();
				input.select();
			}catch(e){}
		});
	}

	editCheck(){
		try{
			let form = this.querySelector('#addressForm');
			let newPhone = {
				number: form.elements['number'].value,
				description: form.elements['description'].value,
			};
			if(this.phoneIndex){
				this.user.company.phones[this.phoneIndex] = newPhone;
			}else{
				this.user.company.phones.push(newPhone);
			}
			this.user = app.updateUser(this.user);
			this.close(true);
		}catch(e){
			alert(e.message);
		}
	}
}
