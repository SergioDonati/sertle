'use strict';

module.exports = function EditPhone(app, modal, company, phoneIndex){

	if(company.phones.length>0 && phoneIndex>=0 && phoneIndex<company.phones.length){
		modal.addRenderLocals('phone', company.phones[phoneIndex]);
	}else{
		phoneIndex = null;
	}

	modal.on('rendered', function(){
		try{
			const input = modal.querySelector('#phoneForm input');
			input.focus();
			input.select();
		}catch(e){}
	});

	modal.addDOMListener('onSubmit', () => {
		try{
			const form = modal.querySelector('#addressForm');
			let newPhone = {
				number: form.elements['number'].value,
				description: form.elements['description'].value,
			};
			if(phoneIndex){
				company.phones[phoneIndex] = newPhone;
			}else{
				company.phones.push(newPhone);
			}
			app.getCollections("Companies").update(company);
			modal.company = company;
			modal.close(true);
		}catch(e){
			alert(e.message);
		}
	});
}
