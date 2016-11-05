'use strict';

// Expose app for test and development
const {app} = require('easyone-electron');

(function(){
	const {DB, Collections, onReady, setUser} = require('../../database');
	const {ipcRenderer, remote} = require('electron');

	if(process.env.NODE_ENV == 'development'){
		//require('devtron').install();
	}

	let user = remote.getCurrentWindow().user;
	setUser(user);

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

		app.on('propertyChanged', function(name, newUser){
			if( name != 'user' ) return;
			user = newUser;
			setUser(newUser);
		});

		/**
		 *	Use this function for update user data
		 * 	@return user updated
		 */
		app.updateUser = function(newUser){
			const Users = Collections['Users'];
			Users.update(newUser);
			const user = Users.get(newUser.$loki);
			app.setProperty('user', user);
			return user;
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

	function clearActiveLink(){
		try{
			let links = document.querySelectorAll('#main-header nav a');
			for (let l of links) {
				l.classList.remove('active');
			}
		}catch(e){
			console.error(e);
		}
	}

	function activateNavLink(link){
		clearActiveLink();
		link.classList.add('active');
	}

	function addNavListener(name, listener, activable = true){
		try{
			let navLink = document.querySelector('#main-header nav a[href="#'+name+'"]');
			navLink.addEventListener('click', function(e){
				e.preventDefault();
				if(navLink.classList.contains('active')) return; // just active
				if (activable) activateNavLink(navLink);
				listener();
			}, true);
		}catch(e){
			console.error(e.stack);
		}
	}

	addNavListener('dashboard', function(){
		app.controllerManager.startNew('dashboard');
	});

	addNavListener('account', function(){
		app.controllerManager.startNew('account');
	});

	addNavListener('info', function(){
		ipcRenderer.send('info-window');
	}, false);

	app.controllerManager.on('changed', function(controllerManager, controller){
		clearActiveLink();
		if(controller.name == 'dashhome'){
			let dashLink = document.querySelector('#main-header nav a[href="#dashboard"]');
			if (dashLink) dashLink.classList.add('active');
		}
		if(controller.name == 'account'){
			let dashLink = document.querySelector('#main-header nav a[href="#account"]');
			if (dashLink) dashLink.classList.add('active');
		}
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
})();
