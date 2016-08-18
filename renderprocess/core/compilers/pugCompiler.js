'use strict';

const BaseCompiler = require('./baseCompiler');

let uniqueCallId = 0;

class PugCompiler extends BaseCompiler{

	compileFile(filePath, options, callback){
		let callId = uniqueCallId++;
		ipcRenderer.once('pug_renderFileAsync-reply-'+callId, (event, html) => {
			if(callback) callback(null, html);
		});

		ipcRenderer.send('pug_renderFileAsync', { id: callId, fileName: filePath, options: options, locals: options.locals });
	}

	compile(str, options, callback){
		let callId = uniqueCallId++;
		ipcRenderer.once('pug_renderAsync-reply-'+callId, (event, html) => {
			if(callback) callback(null, html);
		});

		ipcRenderer.send('pug_renderAsync', { id: callId, str: str, options: options, locals: options.locals });
	}

}
