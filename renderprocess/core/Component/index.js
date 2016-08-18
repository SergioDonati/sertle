'use strict';

const {ipcRenderer} = require('electron');
const EventEmitter = require('events');
const App = require('../App');
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
		this._DOMContainerClass = 'component-'+this.name+' component';

		this.render = require('./render').bind(this);

		this.on('rendered', this._install_children);
		this.on('rendered', function(){
			require('./style').bind(this)();
		});
		this.on('rendered', function(){
			require('./binder').bindEvents(this.HTMLElement, this._DOMListeners);
		});

		this.init();
	}

	// Override this for return the values
	get viewPath(){ return null; }
	get view(){ return this._view; }
	get viewTemplate(){ return this._viewTemplate; }
	get stylePath(){ return null; }
	get style(){ return this._style; }

	init(){}

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

	get currentApp(){ return App.getCurrentApp(); }

	on(eventName, callback){
		this._eventEmitter.on(eventName, callback.bind(this));
	}
}
