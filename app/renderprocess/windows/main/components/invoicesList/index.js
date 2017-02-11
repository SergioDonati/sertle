'use script';

let lastSearchResult = null;

module.exports = function InvoicesList(app, component, companyID) {
	component.setComponentsPath(__dirname);
	component.onChildReady('invoices-list', loadInvoices);

	function setSearchResult(searchResult){
		lastSearchResult = searchResult;
		component.getChildComponent('invoices-list').setInvoices(searchResult.invoices);
		let rangeText = (searchResult.offset+1) + ' - ' + (searchResult.offset+searchResult.invoices.length);
		if(searchResult.count == 0) rangeText = '';

		const rangeSpan = component.querySelector('#range')
		if(rangeSpan) rangeSpan.innerHTML = rangeText;
		const totalSpan = component.querySelector('#total')
		if(totalSpan) totalSpan.innerHTML = searchResult.count;

		try{
			if(searchResult.offset+searchResult.limit < searchResult.count) component.querySelector('#next-btn').style.display = 'inherit'; //this.querySelector('#next-btn').removeAttribute('disabled');
			else component.querySelector('#next-btn').style.display = 'none';
		}catch(e){}

		try{
			if(searchResult.offset>0) component.querySelector('#prev-btn').style.display = 'inherit';
			else component.querySelector('#prev-btn').style.display = 'none';
		}catch(e){}
	}

	function loadInvoices(){
		const result = app.getCollections('Invoices').getAll({ limit: 5, count: true, companyID: companyID });
		setSearchResult(result);
	}

	component.addDOMListener('nextPage', () => {
		if(lastSearchResult.offset+lastSearchResult.limit >= lastSearchResult.count) return;
		let result = app.getCollections('Invoices').getAll({
			offset: lastSearchResult.offset + lastSearchResult.limit,
			limit: lastSearchResult.limit,
			count: true, companyID: companyID
		});
		setSearchResult(result);
	});

	component.addDOMListener('prevPage', () => {
		if(lastSearchResult.offset <= 0) return;
		var result = app.getCollections('Invoices').getAll({
			offset: lastSearchResult.offset - lastSearchResult.limit,
			limit: lastSearchResult.limit,
			count: true, companyID: companyID
		});
		setSearchResult(result);
	});

	component.addDOMListener('newInvoice', () => {
		app.controllerManager.startNew('invoice/new');
	});

};
