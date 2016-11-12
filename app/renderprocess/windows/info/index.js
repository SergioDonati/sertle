'use strict';
const {App} = require('easyone-electron');
const {DB, Collections, onReady} = require('../../database');

const app = new App({ controllersPath: __dirname+'/controllers' });

app.on('ready', function(app){
    app.loadStyle('mainStyle', __dirname+'/../../style/main.less');
    onReady(() => { app.start(); });
});
