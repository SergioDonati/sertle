'use strict';

const {shell} = require('electron');

module.exports = function Info(app, controller) {

	controller.on('rendered', parent => {
		const links = parent.querySelectorAll('a.open-external');

		for(let i=0;i<links.length;i++){
			links[i].addEventListener('click', function(event){
				event.preventDefault();
		    	shell.openExternal(this.href);
			});
		}
	});

};
