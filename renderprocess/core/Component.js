'use strict';

const {ipcRenderer} = require('electron');
const EventEmitter = require('events');
const App = require('./App');
let count = 0;

function install_child(doc, child){
	if (!doc || !child) return;
	let element;
	if(child.container_selector === '_parent') element = doc;
	else element = doc.querySelector(child.container_selector);
	if (!element) return;
	let exist = doc.querySelector('#'+child.component.uniqueID);
	if (exist) return;	// just exist
	child.component.render(child.component.renderArgs, function(err, html){
		element.appendChild(html);
	});
}

function create_doc(html, uniqueID, className){
	let doc = document.createElement('div');
	doc.setAttribute('id', uniqueID);
	if(className){
		doc.className = className;
	}
	doc.innerHTML = html;
	return doc;
}

function add_style(css, uniqueID){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	style.id = 'style_'+uniqueID;
	document.getElementsByTagName('head')[0].appendChild(style);
}

function classNameToSelector(className){
	let names = className.split(' ');
	let selector = '';
	for(let i=0;i<names.length;i++){
		selector+= '.'+names[i];
	}
	return selector;
}

let _eventListener = {};

function bind_event(element, eventName, fun){
	if(!fun || !eventName || !element) return;
	if(!_eventListener[element]) _eventListener[element] = {};
	if(_eventListener[element][eventName]){
		element.removeEventListener(eventName, _eventListener[element][eventName]);
	}
	let listener = function(e){
		e.preventDefault();
		try{
			fun(e, element);
		}catch(err){
			console.error(err.stack);
		}
	}
	_eventListener[element][eventName] = listener;
	element.addEventListener(eventName, listener, true);
}

function bind_events(doc, listeners){
	let elements = doc.querySelectorAll('[bind-event="bind-event"]');
	let bindAttrRegex = /bind-event-([\w]+)/;
	for(let i=0;i<elements.length;i++){
		let element = elements[i];
		for(let j=0;j<element.attributes.length; j++){
			let attr = element.attributes[j];
			let eventName = bindAttrRegex.exec(attr.name.toString());
			if(eventName){
				bind_event(element, eventName[1], listeners[attr.value]);
			}
		}
	}
}

module.exports = class Component {
	constructor ( ){
		this.renderArgs = {
			locals: {},
			options: {
				pretty: true,
				compileDebug: true
			}
		};
		this.name = this.constructor.name.toLowerCase();
		this.uniqueID = this.name + '_' + count;
		count++;
		this._children = [];
		this._eventEmitter = new EventEmitter();
		this._DOMListeners = {};
		this._DOMContainerClass = 'component-'+this.name+' component'

		this.on('rendered', this._install_children);
		this.on('rendered', this._render_style);
		this.on('rendered', function(){
			bind_events(this.doc, this._DOMListeners);
		});

		this.init();
	}

	// Override this for return the values
	get viewPath(){ return null; }
	get stylePath(){ return null; }
	get style(){ return null; }
	get view(){ return null; }
	get viewTemplate(){ return this._viewTemplate; }

	init(){}

	static createDoc(html, uniqueID, name){
		return create_doc(html, uniqueID, name);
	}

	_create_doc(html){
		return create_doc(html, this.uniqueID, this._DOMContainerClass);
	}

	_install_children(){
		let doc = this.doc;
		if(!doc || !this._children) return;
		for(let i=0;i<this._children.length;i++){
			let child = this._children[i];
			if(!child.installed){
				install_child(doc, child);
				child.installed = true;
			}
		}
	}

	registerComponent(container_selector, component){
		if (!component instanceof Component || !component.render) return;
		this._children.push({
			component: component,
			container_selector: container_selector,
			installed: false
		});
		if(this.doc) this._install_children();
	}

	addDOMListener(eventName, listener){
		this._DOMListeners[eventName] = listener;
	}

	_render_style(){
		if(!this.stylePath) return;
		let exist = this.doc.querySelector('style_'+this.uniqueID);
		if(exist){
			this._eventEmitter.emit('style-rendered', css);
			return;
		}
		let options = {
			logLevel:2
		};
		ipcRenderer.once('less_renderFileAsync-reply-'+this.uniqueID, (event, css) => {
			add_style(css, this.uniqueID);
			this._eventEmitter.emit('style-rendered', css);
		});
		ipcRenderer.send('less_renderFileAsync', {
			id: this.uniqueID,
			fileName: this.stylePath,
			options: options,
			wrapWith: classNameToSelector(this._DOMContainerClass)
		});
	}

	get currentApp(){ return App.getCurrentApp(); }

	on(eventName, callback){
		this._eventEmitter.on(eventName, callback.bind(this));
	}

	_render_doc(html, callback){
		this.doc = this._create_doc(html);
		console.log(require('util').inspect(this.doc, { depth: null }));
		this._eventEmitter.emit('rendered', this.doc);
		if(callback) callback(null, this.doc);
	}

	render(args, callback){
		if(this.doc) {
			this._eventEmitter.emit('rendered', this.doc);
			if(callback) callback(null, this.doc);
			return this;
		}
		if(this.view){
			this._render_doc(this.view, callback);
			return this;
		}
		if(!this.viewPath) {
			if(callback) callback(null, null);
			return this;
		}
		args = args || {};
		let locals = args.locals || {};
		let options = args.options || {};
		ipcRenderer.once('pug_renderFileAsync-reply-'+this.uniqueID, (event, html) => {
			this._render_doc(html, callback);
		});
		ipcRenderer.send('pug_renderFileAsync', { id:this.uniqueID, fileName: this.viewPath, options: options, locals: locals });
		return this;
	}
}
