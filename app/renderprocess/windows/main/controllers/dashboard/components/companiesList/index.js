'use script';

const {Component, app} = require('easyone-electron');

module.exports = class CompaniesList extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }
	get componentsPath(){ return __dirname; }

	init(){
		this.addDOMListener('newCompany', this.newCompany.bind(this));
		this.addDOMListener('nextPage', this.nextPage.bind(this));
		this.addDOMListener('prevPage', this.prevPage.bind(this));
		let self = this;
		this.onChildReady('companies-list', function(){
			self.loadCompanies();
		});
	}

	setSearchResult(searchResult){
		this.lastSearchResult = searchResult;
		this.getChildComponent('companies-list').setCompanies(searchResult.companies);
		let rangeText = (searchResult.offset+1) + ' - ' + (searchResult.offset+searchResult.companies.length);
		if(searchResult.count == 0) rangeText = '';

		let rangeSpan = this.querySelector('#range')
		if(rangeSpan) rangeSpan.innerHTML = rangeText;
		let totalSpan = this.querySelector('#total')
		if(totalSpan) totalSpan.innerHTML = searchResult.count;

		try{
			if(searchResult.offset+searchResult.limit < searchResult.count) this.querySelector('#next-btn').style.display = 'inherit';
			else this.querySelector('#next-btn').style.display = 'none';
		}catch(e){}

		try{
			if(searchResult.offset>0) this.querySelector('#prev-btn').style.display = 'inherit';
			else this.querySelector('#prev-btn').style.display = 'none';
		}catch(e){}
	}

	loadCompanies(){
		var result = app.getCollections('Companies').searchByName(null, { limit: 4, count: true });
		this.setSearchResult(result);
	}

	nextPage(){
		if(this.lastSearchResult.offset+this.lastSearchResult.limit >= this.lastSearchResult.count) return;
		let result = app.getCollections('Companies').searchByName(null, {
			offset: this.lastSearchResult.offset + this.lastSearchResult.limit,
			limit: this.lastSearchResult.limit,
			count: true
		});
		this.setSearchResult(result);
	}

	prevPage(){
		if(this.lastSearchResult.offset <= 0) return;
		var result = app.getCollections('Companies').searchByName(null, {
			offset: this.lastSearchResult.offset - this.lastSearchResult.limit,
			limit: this.lastSearchResult.limit,
			count: true
		});
		this.setSearchResult(result);
	}

	newCompany(){
		let self = this;
		app.modalManager.startNew('new/company').then(function(modal){
			modal.on('modalClosed', function(){
				if(modal.result) self.reloadCompanies();
			});
		});
	}

};
