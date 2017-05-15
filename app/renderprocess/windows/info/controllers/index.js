'use strict';

const {shell, ipcRenderer, remote} = require('electron');
const appVersion = remote.app.getVersion();

module.exports = function Info(app, controller) {

	controller.addRenderLocals('appVersion', appVersion);

	controller.on('rendered', parent => {
		const links = parent.querySelectorAll('a.open-external');

		for(let i=0;i<links.length;i++){
			links[i].addEventListener('click', function(event){
				event.preventDefault();
		    	shell.openExternal(this.href);
			});
		}

		ipcRenderer.send('check-updates');
	});

};
