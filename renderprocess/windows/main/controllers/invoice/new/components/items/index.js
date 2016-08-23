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
			this.itemsTableBody = this.itemsTable.querySelector('tbody');
		});
	}

	_insertCell(row, value){
		let newCell = row.insertCell();
		try{
  			newCell.appendChild(document.createTextNode(value));
		}catch(e){
			console.warn(e);
		}
	}

	_insertRow(item){
		let newRow = this.itemsTableBody.insertRow();

		this._insertCell(newRow, item.description);
		this._insertCell(newRow, item.unit);
		this._insertCell(newRow, item.quantity);
		this._insertCell(newRow, item.price);
		this._insertCell(newRow, item.iva);
		this._insertCell(newRow, 0);
	}

	addItem(item){
		let row = this._insertRow(item);
		this._items.set(row, item);
	}

	newItem(){
		let component = this;
		app.modalManager.startNew('new/invoiceItem').then(function(modal){
			modal.once('modalClosed', function(){
				let item = modal.result;
				if(item) component.addItem(item);
			});
		});
	}

	getItems(){
		let items = [];
		this._items.forEach(function(item){
			items.push(item);
		});
		return items;
	}

};
