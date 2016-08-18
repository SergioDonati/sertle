'use strict';

const AppManager = require('./AppManager');
const easyone = require('easyone-electron');

easyone({stylePath: __dirname+'\\..\\renderprocess\\style'});
let appManager = new AppManager();
appManager.start();
