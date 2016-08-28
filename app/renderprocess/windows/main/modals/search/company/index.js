'use strict';

const {Modal,  app} = require('easyone-electron');

module.exports = class NewCompany extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }
    get stylePath(){ return __dirname+'\\style.less'; }
    get componentsPath(){ return __dirname; }

    get companiesPerPage(){ return 6; }

	init(){
        this.companiesMap = new WeakMap();
		this.addDOMListener('onSubmit', this.search.bind(this));
		this.addDOMListener('nextPage', this.nextPage.bind(this));
		this.addDOMListener('prevPage', this.previousPage.bind(this));
        this.on('rendered', function(){
			this.querySelector('#searchInput').focus();
		});

		let self = this;
		this.onChildReady('companies-list', function(){
			self.search();
			self.getChildComponent('companies-list').once('companySelected', function(company){
				self._modal_result = company;
				self.close();
			});
		});
	}

    select(){
        if(this._selectedCompany){
            this._modal_result = this._selectedCompany;
            this.close();
        }else{
            alert('Seleziona un cliente per procedere.');
        }
    }

    previousPage(){
		if(this.lastSearchResult.offset <= 0) return;
		var result = app.getCollections('Companies').searchByName(this.getSearchKey(), {
			offset: this.lastSearchResult.offset - this.lastSearchResult.limit,
			limit: this.lastSearchResult.limit,
			count: true
		});
		this.setSearchResult(result);
    }

    nextPage(){
		if(this.lastSearchResult.offset+this.lastSearchResult.limit >= this.lastSearchResult.count) return;
		let result = app.getCollections('Companies').searchByName(this.getSearchKey(), {
			offset: this.lastSearchResult.offset + this.lastSearchResult.limit,
			limit: this.lastSearchResult.limit,
			count: true
		});
		this.setSearchResult(result);
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

	getSearchKey(){
		let searchInput = this.querySelector('#searchInput');
		return searchInput.value.trim();
	}

	search(){
        let result = app.getCollections('Companies').searchByName(this.getSearchKey(), { limit: this.companiesPerPage, count: true });
		this.setSearchResult(result);
    }
}
