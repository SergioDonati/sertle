'use strict';

const {ipcMain, BrowserWindow, app} = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = function(appManager){

	ipcMain.on('printInvoice', function(event, args){
		const outputPath = path.resolve(appManager.getTempFolder(), 'print_invoice.pdf');
		function reply(err){
			event.sender.send('printInvoice-reply', {
				success: !err,
				error: err,
				outputPath: outputPath
			});
		}

		const invoice = args.invoice;
		if(!invoice) return reply(new Error('Invoice not found'));

		const win = new BrowserWindow({ show:true });
		win.invoice = invoice;
		win.loadURL(path.resolve(app.getAppPath(), 'renderprocess/windows/invoiceA4/index.html'));
		win.printInvoice = function(){
			win.webContents.printToPDF({
				marginsType: 1,
			  	printBackground: true,
			  	printSelectionOnly: false,
			  	landscape: false,
				pageSize: 'A4'
			}, (error, data) => {
    			if (error) return reply(error);
    			fs.writeFile(outputPath, data, (error) => {
      				if (error) return reply(error);
      				//console.log('Write PDF successfully.');
					reply();
					//win.close();
    			});
  			});
		}
	});

	ipcMain.on('printInvoiceF', function(event, args){
		function reply(err){
			event.sender.send('printInvoiceF-reply', {
				success: !err,
				error: err ? err.message : ""
			});
		}

		const invoice = args.invoice;
		if (!invoice) return reply(new Error('Invoice not found'));
		const win = new BrowserWindow({ show:false });
		win.invoice = invoice;
		win.loadURL(path.resolve(app.getAppPath(), 'renderprocess/windows/invoiceA4/index.html'));
		win.printInvoice = function(){
			console.log('printInvoice called');
			try{
				win.webContents.print({
					silent: args.silent || false,
					printBackground: true
				});
				console.log('Printed');
				reply();
			}catch(e){
				reply(e);
			}
		}
	});
}
