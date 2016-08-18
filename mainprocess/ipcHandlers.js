'use strict';

const {ipcMain} = require('electron');
const fs = require('fs');
const DB_PATH = './';

module.exports = function(appManager){

	ipcMain.on('login', function(event, user){
		if(!user) return;
		appManager.user = user;
		let oldWindow = appManager.mainWindow;
		appManager.createWindow();
		oldWindow.close();
	});

	ipcMain.on('logout', function(event, arg){
		appManager.user = null;
		let oldWindow = appManager.mainWindow;
		appManager.createWindow();
		oldWindow.close();
	});

	ipcMain.on('lokiLoadDatabase', function(event, arg){
		try{
			fs.readFile(DB_PATH+arg.dbName, (err, data) => {
				if(err){
					if (err.code === 'ENOENT') {
						event.sender.send('lokiLoadDatabase-reply', '');
						return;
					}else throw err;
				}
				event.sender.send('lokiLoadDatabase-reply', data.toString());
			});
		}catch(e){
			console.log(e.stack);
		}
	});

	ipcMain.on('lokiStoreDatabase', function(event, arg){
		try{
			fs.writeFile(DB_PATH+arg.dbName, arg.dbString, (err, data) => {
	  			if (err) throw err;
				event.sender.send('lokiStoreDatabase-reply', true);
			});
		}catch(e){
			console.log(e.stack);
		}
	});
}
