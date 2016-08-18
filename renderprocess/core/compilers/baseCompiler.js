'use strict';

let uniqueCallId = 0;

module.exports = class BaseCompiler{

	constructor(options){
		this._options = options;
	}

	compileFile(filePath, options, callback){
		let callId = uniqueCallId++;
		ipcRenderer.once('readFile-reply-'+callId, (event, str) => {
			if(callback) callback(null, str);
		});

		ipcRenderer.send('readFile', { id: callId, fileName: filePath });
	}

	compile(str, options, callback){
		if(callback) callback(null, str);
	}

}
