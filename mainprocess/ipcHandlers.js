'use strict';

const {ipcMain} = require('electron');
const fs = require('fs');
const less = require('less');
const pug = require('pug');

const DB_PATH = './';

module.exports = function(){

	ipcMain.on('readFile', function(event, args){
		try{
			fs.readFile(args.filePath, (err, data) => {
	  			if (err) {
					console.error(err.stack);
					throw err;
				}
				if (data) data = data.toString();
				event.sender.send('readFile-reply-'+args.id, data);
			});
		}catch(err){
			console.error(err.stack);
		}
	});

	ipcMain.on('pug_renderAsync', function(event, args) {
		try{
		  	let fn = pug.compile(args.str, args.options);
			let html = fn(args.locals);
			event.sender.send('pug_renderAsync-reply-'+args.id, html);
		}catch(e){
			console.log(e.stack);
		}
	});

	ipcMain.on('pug_renderFileAsync', function(event, arg) {
		try{
		  	let fn = pug.compileFile(arg.fileName, arg.options);
			// TODO cache files compiled
			let html = fn(arg.locals);
			event.sender.send('pug_renderFileAsync-reply-'+arg.id, html);
		}catch(e){
			console.log(e.stack);
		}
	});

	ipcMain.on('less_renderFileAsync', function(event, arg){
		try{
			fs.readFile(arg.fileName, (err, data) => {
	  			if (err) throw err;
				data = data.toString();
				if(data && data.trim() != '' && arg.wrapWith){
					data = arg.wrapWith + '{ ' + data + ' }';
				}
	  			less.render(data, arg.options, function(error, output) {
					if (error) {
						console.error(error);
						throw error;
					}
					event.sender.send('less_renderFileAsync-reply-'+arg.id, output.css);
				});
			});
		}catch(e){
			console.log(e.stack);
		}
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
