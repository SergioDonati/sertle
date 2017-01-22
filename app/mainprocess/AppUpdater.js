'use strict';

const { app, autoUpdater, BrowserWindow, ipcMain } = require("electron");
const os = require("os");

const UPDATE_SERVER_HOST = "nuts.sertle.snakenineproject.pw";

module.exports = class AppUpdater {
	constructor(appManager) {

		if (appManager.isDev()) return;

		const version = app.getVersion();
		autoUpdater.addListener("update-available", (event) => {
			console.log("A new update is available")
			event.sender.send('update-available');
		});
		autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
			console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
			event.sender.send('update-downloaded');
			appManager.requestUpdate(function(){
				autoUpdater.quitAndInstall();
			});
		});
		autoUpdater.addListener("error", (error) => {
			console.warn(error)
		});
		autoUpdater.addListener("checking-for-update", (event) => {
			console.log("checking-for-update")
			event.sender.send('checking-for-update');
		});
		autoUpdater.addListener("update-not-available", () => {
			console.log("update-not-available")
			event.sender.send('update-not-available');
		});
		autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/${os.platform()}_${os.arch()}/${version}`);

		ipcMain.on('check-updates', (event) => {
			autoUpdater.checkForUpdates();
		});
		ipcMain.on('quit-and-update', (event) => {
			autoUpdater.quitAndInstall();
		});
	}

	checkForUpdates(){
		autoUpdater.checkForUpdates();
	}

	on(eventName, listener){
		autoUpdater.addListener(eventName, listener);
	}

}
