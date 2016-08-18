'use strict';

const less = require('less');
const utils = require('../utils');

function addStyleToDOM(css, uniqueID){
	let style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	style.id = 'style_'+uniqueID;
	document.getElementsByTagName('head')[0].appendChild(style);
}

function compile(data, wrapWith, options, callback){
	if(data && data.trim() != '' && wrapWith){
		data = wrapWith + '{ ' + data + ' }';
	}
	less.render(data, options, function(error, output) {
		if (error) {
			console.error(error);
			return callback(error);
		}
		callback(null, output.css)
	});
}

let defaultLessOptions = { logLevel:2 };


/**
 *	stylePath -> style (less) -> css
 */
function render(callback){
	let styleId = 'style_'+this.uniqueID;
	let exist = document.getElementById(styleId);
	if(exist){
		this._eventEmitter.emit('style-rendered', css);
		return;
	}
	let wrapWith = utils.classNameToSelector(this._DOMContainerClass);

	if(this._css){
		addStyleToDOM(this._css, styleId);
		this._eventEmitter.emit('style-rendered', this._css);
	}else if(this.style){
		compile(this.style, wrapWith, defaultLessOptions, function(err, css){
			if(err){
				if(callback) callback(err);
				return;
			}
			this._css = css;
			render.bind(this)(callback);
		}.bind(this));
	}else if(this.stylePath){
		utils.readFile(this.stylePath, function(err, text){
			if(err){
				if(callback) callback(err);
				return;
			}
			this._style = text;
			render.bind(this)(callback);
		}.bind(this));
	}
}

module.exports = render;
