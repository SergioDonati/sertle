'use strict';

const {app, BrowserWindow, dialog} = require('electron');
const ipcAccess = require('./ipcAccess');
const ipcLoki = require('./ipcLoki');
const ipcPrint = require('./ipcPrint');
const AppUpdater = require('./AppUpdater');
const path = require('path');
const fs = require('fs');

module.exports = class AppManager{
	constructor(){
		this._mainWindow = null;
		this.infoIndexPath = `file://${path.resolve(app.getAppPath(), 'renderprocess/windows/info/index.html')}`;
		this.accessIndexPath = `file://${path.resolve(app.getAppPath(), 'renderprocess/windows/access/index.html')}`;
		this.mainIndexPath = `file://${path.resolve(app.getAppPath(), 'renderprocess/windows/main/index.html')}`;
		this.started = false;

		function createFolder(){
			fs.mkdirSync(this.getDataFolder());
			console.log('Created App Data Folder: '+this.getDataFolder()+'');
		}
		try{
			let stats = fs.statSync(this.getDataFolder());
			if(!stats.isDirectory()) createFolder.call(this);
		}catch(e){
			if(e.code == 'ENOENT') createFolder.call(this);
			else throw e;
		}

		this.appUpdater = new AppUpdater(this);
	}

	get user(){ return this._user; }
	set user(x){ this._user = x; }

	get mainWindow(){ return this._mainWindow; }

	get defaultMainWindowOptions(){
		return {width: 1080, height: 600, center:true, icon: path.resolve(app.getAppPath(), 'resources','icon.ico'), frame:false, show:false};
	}
	get defaultAccessWindowOptions(){
		return {width: 800, height: 500, center:true, icon: path.resolve(app.getAppPath(), 'resources','icon.ico') };
	}

	getDataFolder(){
		return path.join(app.getPath('appData'), 'Sertle');
	}
	getTempFolder(){
		return app.getPath('temp');
	}

	isDev() {
		return app.getPath("exe").includes("\\node_modules\\electron-prebuilt\\")
	}

	_createWindow(loadUrl, windowOptions, readyCallback){
		const self = this;

		// Create the browser window.
		const newWindow = new BrowserWindow(windowOptions);
		if(self.user) newWindow.user = self.user;
		// and load the index.html of the app.
		newWindow.loadURL(loadUrl);
		newWindow.setMenu(null);

		//if(this.isDev()){
			// Open the DevTools.
			newWindow.webContents.openDevTools();
		//}

		// Emitted when the window is closed.
		newWindow.on('closed', function () {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			if(self._mainWindow == newWindow) self._mainWindow = null;
		});
		if(readyCallback){
			newWindow.on('ready-to-show', function(){
				readyCallback(newWindow);
			});
		}
		newWindow.on('unresponsive', function () {
		  	dialog.showMessageBox({
		    	type: 'info',
		    	message: 'La finestra non risponde, ricaricare la finestra?',
		    	buttons: ['Cancel', 'Reload']
		  	});
		});

		newWindow.webContents.on('crashed', function () {
			dialog.showErrorBox('Errore', 'Si è verificato un errore riavviare l\'applicazione!');
		});
		self._mainWindow = newWindow;
		return newWindow;
	}

	createAccessWindow(){
		if(this.user) return this.createMainWindow();
		return this._createWindow(this.accessIndexPath, this.defaultAccessWindowOptions);
	}
	createMainWindow(callback){
		if(!this.user) return this.createAccessWindow();
		let self = this;
		return self._createWindow(self.mainIndexPath, self.defaultMainWindowOptions, function(newWindow){
			newWindow.show();
			if(callback) callback(newWindow);
		});
	}
	openInfoWindow(){
		this._createWindow(this.infoIndexPath, this.defaultAccessWindowOptions);
	}

	start(){
		if(this.started) return;

		// Initialize the ipcHandlers with this manager
		ipcAccess(this);
		ipcLoki(this);
		ipcPrint(this);

		const self = this;

		// This method will be called when Electron has finished
		// initialization and is ready to create browser windows.
		// Some APIs can only be used after this event occurs.
		app.on('ready', self.createAccessWindow.bind(this));

		// Quit when all windows are closed.
		app.on('window-all-closed', function () {
		  	// On OS X it is common for applications and their menu bar
		  	// to stay active until the user quits explicitly with Cmd + Q
		  	if (process.platform !== 'darwin') {
		    	app.quit();
		  	}
		});

		app.on('activate', function () {
		  	// On OS X it's common to re-create a window in the app when the
		  	// dock icon is clicked and there are no other windows open.
		  	if (mainWindow === null) {
		    	self.createAccessWindow();
		  	}
		});
		process.on('uncaughtException', function (err) {
			console.error(err.stack);
			dialog.showErrorBox('Error', 'Si è verificato un errore riavviare l\'applicazione!\nErrore:'+err.message);
			//app.quit();
		});

		this.started = true;
	}

	requestUpdate(update){
		let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
		if (releaseNotes) {
			const splitNotes = releaseNotes.split(/[^\r]\n/);
			message += '\n\nRelease notes:\n';
			splitNotes.forEach(notes => {
				message += notes + '\n\n';
			});
		}
		// Ask user to update the app
		dialog.showMessageBox({
			type: 'question',
			buttons: ['Install and Relaunch', 'Later'],
			defaultId: 0,
			message: 'A new version of ' + app.getName() + ' has been downloaded',
			detail: message
		}, response => {
			if (response === 0) {
				setTimeout(() => update(), 1);
			}
		});
	}
}
