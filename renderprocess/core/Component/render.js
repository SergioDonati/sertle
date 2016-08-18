'use strict';

const pug = require('pug');
const utils = require('../utils');
const {ipcRenderer} = require('electron');

function createHTMLElement(html, uniqueID, className){
	let element = document.createElement('div');
	element.setAttribute('id', uniqueID);
	if(className){
		element.className = className;
	}
	element.innerHTML = html;
	return element;
}

function createViewTemplate(view, viewEngine, options, callback){
	let fn = function(locals){ return view; };
	if(viewEngine == 'pug') {
		fn = pug.compile(view, options);
	}
	return callback(null, fn);
}

/**
 *	viewPath -> view (viewEngine) -> viewTemplate -> html -> HTMLElement
 */
function render(args, callback){
	args = args || {};
	if(this.HTMLElement) {
		this._eventEmitter.emit('rendered', this.HTMLElement);
		if(callback) callback(null, this.HTMLElement);
	}else if(this.viewTemplate){
		let locals = args.locals || {};
		let html = this.viewTemplate(locals);
		this.HTMLElement = createHTMLElement(html, this.uniqueID, this._DOMContainerClass);
		this._eventEmitter.emit('rendered', this.HTMLElement);
		if(callback) callback(null, this.HTMLElement);
	}else if(this.view){
		let options = args.options || null;
		createViewTemplate(this.view, this.viewEngine || args.viewEngine || 'pug', options, function(err, fn){
			this._viewTemplate = fn;
			render.bind(this)(args, callback);
		}.bind(this));
	}else if(this.viewPath){
		utils.readFile(this.viewPath, function(err, text){
			this._view = text;
			render.bind(this)(args, callback);
		}.bind(this));
	}
	return this;
}

module.exports = render;
