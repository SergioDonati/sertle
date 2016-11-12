'use strict';

module.exports = function ItemsComponent(app, component) {
	const elements = {};
	const items = new Map();

	component.on('rendered', function(){
		elements.itemsTable = component.querySelector('#items-table');
		elements.itemsTableBody = elements.itemsTable.querySelector('tbody');
	});

	function insertCell(row, value){
		const newCell = row.insertCell();
		try{
  			newCell.appendChild(document.createTextNode(value));
		}catch(e){
			console.warn(e);
		}
	}

	function insertRow(item){
		const newRow = elements.itemsTableBody.insertRow();

		insertCell(newRow, item.description);
		insertCell(newRow, item.unit);
		insertCell(newRow, item.quantity);
		insertCell(newRow, item.price);
		insertCell(newRow, item.iva);
		insertCell(newRow, 0);
		return newRow;
	}

	component.addDOMListener('newItem', () => {
		app.modalManager.startNew('new/invoiceItem').then(function(modal){
			modal.on('result', function(item){
				if(item) component.addItem(item);
			});
		});
	});

	component.addItem = item => {
		const row = insertRow(item);
		items.set(row, item);
	}

	component.getItems = () => {
		const resultItems = [];
		items.forEach( item => { resultItems.push(item); });
		return resultItems;
	}

};
