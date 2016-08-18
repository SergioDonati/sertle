'use strict';
const {app} = require('easyone-electron');
const {DB, Collections, onReady} = require('../../database');
const {ipcRenderer, remote} = require('electron');

let user = remote.getCurrentWindow().user;

app.on('ready', function(app){
    app.setOptions({
        controllersPath: __dirname+'/controllers',
        modalsPath: __dirname+'/modals'
    });
    app.setProperty('user', user);
    app.getDB = function(){
        return DB;
    }
    app.getCollections = function(name){
        if(name) return Collections[name];
        return Collections;
    }
    app.loadStyle('mainStyle', __dirname+'/../../style/main.less');
    app.logout = function(user){
        ipcRenderer.send('logout', user);
    };
    onReady(function(){
        app.start();
    });
});
