'use script';

const {Component, app} = require('easyone-electron');

module.exports = class InvoicesList extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }
	get componentsPath(){ return __dirname; }

	init(companyID){
		this.addDOMListener('newInvoice', this.newInvoice.bind(this));
		this.addDOMListener('nextPage', this.nextPage.bind(this));
		this.addDOMListener('prevPage', this.prevPage.bind(this));
		let self = this;
		this.onChildReady('invoices-list', function(){
			self.loadInvoices();
		});

		this.companyID = companyID;
	}

	setSearchResult(searchResult){
		this.lastSearchResult = searchResult;
		this.getChildComponent('invoices-list').setInvoices(searchResult.invoices);
		let rangeText = (searchResult.offset+1) + ' - ' + (searchResult.offset+searchResult.invoices.length);
		if(searchResult.count == 0) rangeText = '';

		let rangeSpan = this.querySelector('#range')
		if(rangeSpan) rangeSpan.innerHTML = rangeText;
		let totalSpan = this.querySelector('#total')
		if(totalSpan) totalSpan.innerHTML = searchResult.count;

		try{
			if(searchResult.offset+searchResult.limit < searchResult.count) this.querySelector('#next-btn').style.display = 'inherit'; //this.querySelector('#next-btn').removeAttribute('disabled');
			else this.querySelector('#next-btn').style.display = 'none';
		}catch(e){}

		try{
			if(searchResult.offset>0) this.querySelector('#prev-btn').style.display = 'inherit';
			else this.querySelector('#prev-btn').style.display = 'none';
		}catch(e){}
	}

	loadInvoices(){
		var result = app.getCollections('Invoices').getAll({ limit: 5, count: true, companyID: this.companyID });
		this.setSearchResult(result);
	}

	nextPage(){
		if(this.lastSearchResult.offset+this.lastSearchResult.limit >= this.lastSearchResult.count) return;
		let result = app.getCollections('Invoices').getAll(null, {
			offset: this.lastSearchResult.offset + this.lastSearchResult.limit,
			limit: this.lastSearchResult.limit,
			count: true, companyID: this.companyID
		});
		this.setSearchResult(result);
	}

	prevPage(){
		if(this.lastSearchResult.offset <= 0) return;
		var result = app.getCollections('Invoices').getAll(null, {
			offset: this.lastSearchResult.offset - this.lastSearchResult.limit,
			limit: this.lastSearchResult.limit,
			count: true, companyID: this.companyID
		});
		this.setSearchResult(result);
	}

	newInvoice(){
		app.controllerManager.startNew('invoice/new');
	}

};
