'use strict';
const {app} = require('easyone-electron');
const {ipcRenderer, remote} = require('electron');

let invoice = remote.getCurrentWindow().invoice;

app.on('ready', function(app){
    app.setOptions({
        controllersPath: __dirname+'/controllers'
    });
    app.setProperty('invoice', invoice);
    app.loadStyle('mainStyle', __dirname+'/../../style/main.less');
    app.start();
});
