'use strict';

const {Controller, app} = require('easyone-electron');
const {shell} = require('electron');

module.exports = class Info extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }

	init(){
		this.on('rendered', this.registerElements);
	}

	registerElements(parent){
		const links = parent.querySelectorAll('a.open-external');

		for(let i=0;i<links.length;i++){
			links[i].addEventListener('click', function(event){
				event.preventDefault();
		    	shell.openExternal(this.href);
			});
		}
	}

};
