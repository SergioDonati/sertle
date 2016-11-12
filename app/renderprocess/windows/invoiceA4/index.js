'use strict';
const {App} = require('easyone-electron');
const {ipcRenderer, remote} = require('electron');

const invoice = remote.getCurrentWindow().invoice;

const app = new App({ controllersPath: __dirname+'/controllers' });
app.print = () => { remote.getCurrentWindow().printInvoice(); }

function waitLoad(){
	const isStyleLoaded = document.getElementById('printStyle');
	const isMain = document.getElementById('main');
	if(isStyleLoaded && isMain) app.print();
	else setTimeout(waitLoad, 200);
}

app.on('ready', function(app){
    app.setProperty('invoice', invoice);
    app.loadStyle('printStyle', __dirname+'/style.less');
    app.win = remote.getCurrentWindow();

    app.start();

	waitLoad();
});
