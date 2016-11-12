'use strict';

module.exports = function EditField(app, modal, options){

	modal.addRenderLocals('options', options);

	modal.on('rendered', function(){
		try{
			modal.querySelector('#fieldForm input').focus();
			modal.querySelector('#fieldForm input').select();
		}catch(e){}
	});

	modal.addDOMListener('onSubmit', () => {
		try{
			const form = modal.querySelector('#fieldForm');
			const newval = form.elements['new-value'].value;
			if(options.checkValue){
				options.checkValue(newval);
			}
			modal.close(newval);
		}catch(e){
			console.error(e.stack);
			alert(e.message);
		}
	});
}
