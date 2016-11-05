'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class EditAddress extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(user, addressIndex){
		this.user = user;
		if(user.company.addresses.length>0 && addressIndex>=0 && addressIndex<user.company.addresses.length){
			this.addressIndex = addressIndex;
			this.addRenderLocals('address', user.company.addresses[addressIndex]);
		}
		this.addDOMListener('onSubmit', this.editCheck.bind(this));
		this.on('rendered', function(){
			try{
				let input = this.querySelector('#addressForm input');
				input.focus();
				input.select();
			}catch(e){}
		});
	}

	editCheck(){
		try{
			let form = this.querySelector('#addressForm');
			let newAddress = {
				street: form.elements['street'].value,
				number: form.elements['number'].value,
				postalCode: form.elements['postalCode'].value,
				city: form.elements['city'].value,
				nation: form.elements['nation'].value
			};
			if(this.addressIndex){
				this.user.company.addresses[this.addressIndex] = newAddress;
			}else{
				this.user.company.addresses.push(newAddress);
			}
			this.user = app.updateUser(this.user);
			this.close(true);
		}catch(e){
			alert(e.message);
		}
	}
}
