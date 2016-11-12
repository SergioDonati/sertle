'use strict';

const companiesPerPage = 6;

module.exports = function NewCompany(app, modal){
	const companiesMap = new WeakMap();
	let lastSearchResult = null;
	modal.setComponentsPath(__dirname);

	modal.addDOMListener('onSubmit', search);

    modal.on('rendered', function(){
		modal.querySelector('#searchInput').focus();
	});

	modal.onChildReady('companies-list', function(){
		search();
		modal.getChildComponent('companies-list').once('companySelected', function(company){
			modal.close(company);
		});
	});

	modal.addDOMListener('prevPage', () => {
		if(lastSearchResult.offset <= 0) return;
		var result = app.getCollections('Companies').searchByName(getSearchKey(), {
			offset: lastSearchResult.offset - lastSearchResult.limit,
			limit: lastSearchResult.limit,
			count: true
		});
		setSearchResult(result);
    });

	modal.addDOMListener('nextPage', () => {
		if(lastSearchResult.offset+lastSearchResult.limit >= lastSearchResult.count) return;
		let result = app.getCollections('Companies').searchByName(getSearchKey(), {
			offset: lastSearchResult.offset + lastSearchResult.limit,
			limit: lastSearchResult.limit,
			count: true
		});
		setSearchResult(result);
    });

	function setSearchResult(searchResult){
		lastSearchResult = searchResult;
		modal.getChildComponent('companies-list').setCompanies(searchResult.companies);

		let rangeText = (searchResult.offset+1) + ' - ' + (searchResult.offset+searchResult.companies.length);
		if(searchResult.count == 0) rangeText = '';

		const rangeSpan = modal.querySelector('#range')
		if(rangeSpan) rangeSpan.innerHTML = rangeText;
		const totalSpan = modal.querySelector('#total')
		if(totalSpan) totalSpan.innerHTML = searchResult.count;

		try{
			if(searchResult.offset+searchResult.limit < searchResult.count) modal.querySelector('#next-btn').style.display = 'inherit';
			else modal.querySelector('#next-btn').style.display = 'none';
		}catch(e){}

		try{
			if(searchResult.offset>0) modal.querySelector('#prev-btn').style.display = 'inherit';
			else modal.querySelector('#prev-btn').style.display = 'none';
		}catch(e){}
	}

	function getSearchKey(){
		const searchInput = modal.querySelector('#searchInput');
		return searchInput.value.trim();
	}

	function search(){
        const result = app.getCollections('Companies').searchByName(getSearchKey(), { limit: companiesPerPage, count: true });
		setSearchResult(result);
    }
}
