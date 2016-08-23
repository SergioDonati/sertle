'use strict';

const {ipcMain, BrowserWindow} = require('electron');
const fs = require('fs');
const DB_PATH = './';

module.exports = function(appManager){

	ipcMain.on('login', function(event, user){
		if(!user) return;
		appManager.user = user;
		let oldWindow = appManager.mainWindow;
		appManager.createMainWindow(function(){
			oldWindow.close();
		});
	});

	ipcMain.on('logout', function(event, arg){
		appManager.user = null;
		let oldWindow = appManager.mainWindow;
		appManager.createAccessWindow();
		oldWindow.close();
	});

	ipcMain.on('printInvoice', function(event, args){
		let outputPath = __dirname+'/../tmp/print.pdf';

		function reply(err){
			event.sender.send('printInvoice-reply', {
				success: !err,
				error: err,
				outputPath: outputPath
			});
		}

		let invoice = args.invoice;
		if(!invoice) return reply(new Error('Invoice not found'));

		let win = new BrowserWindow({width: 1200, height: 600, /*show:false*/});
		win.invoice = invoice;
		win.loadURL(__dirname+'/../renderprocess/windows/invoiceA4/index.html');
		win.webContents.openDevTools();
		/*win.webContents.on('did-finish-load', () => {
  			// Use default printing options
  			win.webContents.printToPDF({
				marginsType: 0,
			  	printBackground: true,
			  	printSelectionOnly: false,
			  	landscape: false,
				pageSize: 'A4'
			}, (error, data) => {
    			if (error) return reply(error);
    			fs.writeFile(outputPath, data, (error) => {
      				if (error) return reply(error);
      				console.log('Write PDF successfully.');
					reply();
					win.close();
    			});
  			});
		});*/
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
