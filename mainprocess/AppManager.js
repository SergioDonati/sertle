'use strict';

const {app, BrowserWindow} = require('electron');
const ipcHandlers = require('./ipcHandlers');

module.exports = class AppManager{
	constructor(){
		this._mainWindow = null;
		this.accessIndexPath = `file://${__dirname}/../renderprocess/windows/access/index.html`;
		this.mainIndexPath = `file://${__dirname}/../renderprocess/windows/main/index.html`;
		this.started = false;
	}

	get user(){ return this._user; }
	set user(x){ this._user = x; }

	get mainWindow(){ return this._mainWindow; }

	get defaultWindowOptions(){
		return {width: 800, height: 600, center:true, icon: __dirname+'\\..\\SWlogo.ico' };
	}

	createWindow(){
		let loadUrl = this.accessIndexPath;
		if(this.user) loadUrl = this.mainIndexPath;
		let manager = this;

		// Create the browser window.
		this._mainWindow = new BrowserWindow(this.defaultWindowOptions);
		this.mainWindow.user = this.user;

		// and load the index.html of the app.
		this.mainWindow.loadURL(loadUrl);

		this.mainWindow.setMenu(null);

		// Open the DevTools.
		this.mainWindow.webContents.openDevTools();

		let mainWindow = manager.mainWindow;
		// Emitted when the window is closed.
		this.mainWindow.on('closed', function () {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			if(manager._mainWindow == mainWindow) manager._mainWindow = null;
		});
	}

	start(){
		if(this.started) return;
		ipcHandlers(this);
		let manager = this;
		// This method will be called when Electron has finished
		// initialization and is ready to create browser windows.
		// Some APIs can only be used after this event occurs.
		app.on('ready', manager.createWindow.bind(this));

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
		    	manager.createWindow();
		  	}
		});
		this.started = true;
	}
}
