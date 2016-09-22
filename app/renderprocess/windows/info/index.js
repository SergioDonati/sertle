'use strict';
const {app} = require('easyone-electron');
const {DB, Collections, onReady} = require('../../database');
const {ipcRenderer} = require('electron');

app.on('ready', function(app){
    app.setOptions({
        controllersPath: __dirname+'/controllers'
    });
    app.loadStyle('mainStyle', __dirname+'/../../style/main.less');
    onReady(function(){
        app.start();
    });
});
