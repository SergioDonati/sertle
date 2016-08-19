'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class ItemsComponent extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	//get stylePath(){ return __dirname+'\\style.less'; }

	init(){
		this._items = new Map();
		this.addDOMListener('newItem', this.newItem.bind(this));
		this.on('rendered', function(){
			this.itemsTable = this.HTMLElement.querySelector('#items-table');
		});
	}

	_createDOMtd(value){
		let td = document.createElement('td');
		td.innerHTML = value;
		return td;
	}

	_createDOMItem(item){
		let tr = document.createElement('tr');
		tr.appendChild(this._createDOMtd(item.description));
		tr.appendChild(this._createDOMtd(item.unit));
		tr.appendChild(this._createDOMtd(item.quantity));
		tr.appendChild(this._createDOMtd(item.price));
		tr.appendChild(this._createDOMtd(item.iva));
		tr.appendChild(this._createDOMtd(0));
		return tr;
	}

	addItem(item){
		let itemElement = this._createDOMItem(item);
		this._items.set(itemElement, item);
		this.itemsTable.appendChild(itemElement);
	}

	newItem(){
		let component = this;
		app.modalManager.startNew('new/invoiceItem').then(function(modal){
			modal.once('modalClosed', function(){
				let item = modal.result;
				component.addItem(item);
			});
		});
	}

};
