'use strict';

const {DB, Collections} = require('./database');
const Controller = require('./Controller');
const Modal = require('./Modal');

class App {
	constructor(options){
		this._property = {};
		this._options = options || {};
		if(this._options.container_id){
			this.controllerContainer = window.document.getElementById(this._options.container_id);
		}
		if(this._options.modal_container_id){
			this.modalContainer = window.document.getElementById(this._options.modal_container_id);
			if(this._options.modal_content_selector){
				this.modalContent = this.modalContainer.querySelector(this._options.modal_content_selector);
			}
			let closeBtn = this.modalContainer.querySelector('.modal-close-btn');
			if(closeBtn){
				closeBtn.addEventListener('click', (function(e){
					e.preventDefault();
					if(this.activeModal) this.activeModal.close();
				}).bind(this), true);
			}
		}

	}

	init(){
		if(this._options.controllersPath){
			let controller = require(this._options.controllersPath);
			if(controller){
				this.startNewController(new controller());
			}
		}
	}

	setControllerContainer(container_id){
		this.controllerContainer = window.document.getElementById(container_id);
	}

	startNewModal(modal){
		if(typeof(modal) === 'string' && this._options.modalsPath){
			try{
				modal = require(this._options.modalsPath + '/' + modal);
				modal = new modal();
			}catch(e){
				console.error(e);
			}
		}
		if(!modal || !modal instanceof Modal){
			console.error('Invalid modal!');
			return;
		}
		if(!this.modalContainer) return;
		if(this.activeModal) return;
		modal.on('close_modal', (function(){
			this.modalContainer.className = this.modalContainer.className.replace('modal-open', '');
			this.activeModal = null;
		}).bind(this));
		if(this.modalContent) this.modalContent.innerHTML = '';
		else this.modalContainer.innerHTML = '';
		process.nextTick((function(){
			console.log('nexttick');
			modal.render(modal.renderArgs, (err, html) => {
				console.log('rendered');
				if(!html){
					console.error('Invalid rendered.');
					return;
				}
				this.activeModal = modal;
				if(this.modalContent) this.modalContent.appendChild(html);
				else this.modalContainer.appendChild(html);
				this.modalContainer.className = this.modalContainer.className + 'modal-open';
			});
		}).bind(this));
		return modal;
	}

	startNewController(controller){
		if(typeof(controller) === 'string' && this._options.controllersPath){
			try{
				let controllerPath = controller;
				controller = require(this._options.controllersPath + '/' + controllerPath);
				controller = new controller();

				window.location.hash = controllerPath;
			}catch(e){
				console.error(e);
			}
		}
		if(!controller || !controller.render){
			console.error('Invalid controller.');
			return;
		}
		if(!this.controllerContainer) return;
		process.nextTick((function(){
			this.controllerContainer.innerHTML = '';
			controller.render(controller.renderArgs, (err, html) => {
				if(!html){
					console.error('Invalid rendered.');
					return;
				}
				this.actveController = controller;
				this.controllerContainer.appendChild(html);
			});
		}).bind(this));
		return controller;
	}

	getProperty(name){
		return this._property[name];
	}

	setProperty(name, value){
		this._property[name] = value;
	}

	getDB(){
		return DB;
	}

	getCollections(name){
		if(name) return Collections[name];
		return Collections;
	}
}

var currentApp = null;

module.exports.getCurrentApp = function(){ return currentApp; };

module.exports.start = function(options){
	currentApp = new App(options);
	currentApp.init();
	return currentApp;
};
