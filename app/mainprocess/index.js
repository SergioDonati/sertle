'use strict';

if(require('./squirrelStartup')) return;

const AppManager = require('./AppManager');
const easyone = require('easyone-electron');
const path = require('path');
const {app} = require('electron');

easyone({stylePath: path.resolve(app.getAppPath(), 'renderprocess/style')});
let appManager = new AppManager();
appManager.start();
