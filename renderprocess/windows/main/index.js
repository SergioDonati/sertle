'use strict';
const {app} = require('easyone-electron');
const {DB, Collections, onReady} = require('../../database');
const {ipcRenderer, remote} = require('electron');

let user = remote.getCurrentWindow().user;

app.on('ready', function(app){
    app.setOptions({
        controllersPath: __dirname+'/controllers',
        modalsPath: __dirname+'/modals',
		container_id: 'body'
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
	app.loadStyle('templateStyle', __dirname+'/style.less');
    app.logout = function(){
        ipcRenderer.send('logout', user);
    };
    onReady(function(){
        app.start();
    });
});

function activateNavLink(link){
	try{
		let links = document.querySelectorAll('#main-header nav a');
		for (l of links) {
			l.classList.remove('active');
		}
	}catch(e){}
	link.classList.add('active');
}

function addNavListener(name, listener){
	try{
		let navLink = document.querySelector('#main-header nav a[href="#'+name+'"]');
		navLink.addEventListener('click', function(e){
			e.preventDefault();
			if(navLink.classList.contains('active')) return; // just active
			activateNavLink(navLink);
			listener();
		});
	}catch(e){
		console.error(e.stack);
	}
}

addNavListener('dashboard', function(){
	app.startNew('dashboard');
});

document.getElementById("window-min-btn").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   window.minimize();
});

document.getElementById("window-max-btn").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   if (!window.isMaximized()) {
       window.maximize();
   } else {
       window.unmaximize();
   }
});

document.getElementById("window-close-btn").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   window.close();
});
