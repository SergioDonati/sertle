'use strict';

const starter = require('./starter');
const ipcHandlers = require('./ipcHandlers');
require('easyone-electron')({stylePath: __dirname+'\\..\\style'});


let env = process.env.NODE_ENV || 'dev';

if(env == 'dev'){
	require('electron-reload')(__dirname+'\\renderprocess', {
  		electron: require('electron-prebuilt')
	});
}

ipcHandlers();
starter.start();
