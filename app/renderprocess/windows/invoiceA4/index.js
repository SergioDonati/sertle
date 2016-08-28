'use strict';
const {app} = require('easyone-electron');
const {ipcRenderer, remote} = require('electron');

let invoice = remote.getCurrentWindow().invoice;

function waitLoad(){
	let isStyleLoaded = document.getElementById('printStyle');
	let isMain = document.getElementById('main');
	if(isStyleLoaded && isMain) app.print();
	else setTimeout(waitLoad, 200);
}

app.on('ready', function(app){
    app.setOptions({
        controllersPath: __dirname+'/controllers'
    });
    app.setProperty('invoice', invoice);
    app.loadStyle('printStyle', __dirname+'/style.less');
    app.win = remote.getCurrentWindow();
    app.print = function(){
        remote.getCurrentWindow().printInvoice();
    };
    app.start();

	waitLoad();
});
