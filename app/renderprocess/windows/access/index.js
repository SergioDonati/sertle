'use strict';
(function(){
	const {App} = require('easyone-electron');
	const {DB, Collections, onReady} = require('../../database');
	const {ipcRenderer} = require('electron');

	const app = new App({
		controllersPath: __dirname+'/controllers',
		modalsPath: __dirname+'/modals'
	});

	app.on('ready', function(app){
	    app.getDB = function(){
	        return DB;
	    }
	    app.getCollections = function(name){
	        if(name) return Collections[name];
	        return Collections;
	    }
	    app.loadStyle('mainStyle', __dirname+'/../../style/main.less');
	    app.login = function(user){
	        ipcRenderer.send('login', user);
	    };
	    onReady(function(){
			const user = app.getCollections('Users').getDefault();
			if(!user){
				app.start('newUser');
			}else{
				app.login(user);
			}
	    });
	});
})();
