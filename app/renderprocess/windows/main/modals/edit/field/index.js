'use strict';

const {Modal, app} = require('easyone-electron');

module.exports = class EditField extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }

	init(options){
		this.options = options || {};
		this.addRenderLocals('options', this.options);
		this.addDOMListener('onSubmit', this.editCheck.bind(this));
		this.on('rendered', function(){
			try{
				this.querySelector('#fieldForm input').focus();
				this.querySelector('#fieldForm input').select();
			}catch(e){}
		});
	}

	editCheck(){
		try{
			let form = this.querySelector('#fieldForm');
			let newval = form.elements['new-value'].value;
			if(this.options.checkValue){
				this.options.checkValue(newval);
			}
			this.close(newval);
		}catch(e){
			console.error(e.stack);
			alert(e.message);
		}
	}
}
