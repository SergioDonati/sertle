'use strict';

if (require('./squirrelStartup')) return;

const AppManager = require('./AppManager');
const easyone = require('easyone-electron');
const path = require('path');
const {app} = require('electron');

easyone({
	less:{
		basedir: path.resolve(app.getAppPath(), 'renderprocess/style')
	},
	pug:{
		basedir: path.resolve(app.getAppPath(), 'renderprocess/mixins')
	}
});

const appManager = new AppManager();
appManager.start();
