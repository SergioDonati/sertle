'use script';

let lastSearchResult = null;

module.exports = function CompaniesList(app, component){

	component.setComponentsPath(__dirname);

	component.onChildReady('companies-list', loadCompanies);

	function setSearchResult(searchResult){
		lastSearchResult = searchResult;
		component.getChildComponent('companies-list').setCompanies(searchResult.companies);
		let rangeText = (searchResult.offset+1) + ' - ' + (searchResult.offset+searchResult.companies.length);
		if(searchResult.count == 0) rangeText = '';

		const rangeSpan = component.querySelector('#range')
		if(rangeSpan) rangeSpan.innerHTML = rangeText;
		const totalSpan = component.querySelector('#total')
		if(totalSpan) totalSpan.innerHTML = searchResult.count;

		try{
			if(searchResult.offset+searchResult.limit < searchResult.count) component.querySelector('#next-btn').style.display = 'inherit';
			else component.querySelector('#next-btn').style.display = 'none';
		}catch(e){}

		try{
			if(searchResult.offset>0) component.querySelector('#prev-btn').style.display = 'inherit';
			else component.querySelector('#prev-btn').style.display = 'none';
		}catch(e){}
	}

	function loadCompanies(){
		const result = app.getCollections('Companies').searchByName(null, { limit: 4, count: true });
		setSearchResult(result);
	}

	component.addDOMListener('nextPage', () => {
		if(lastSearchResult.offset+lastSearchResult.limit >= lastSearchResult.count) return;
		const result = app.getCollections('Companies').searchByName(null, {
			offset: lastSearchResult.offset + lastSearchResult.limit,
			limit: lastSearchResult.limit,
			count: true
		});
		setSearchResult(result);
	});

	component.addDOMListener('prevPage', () => {
		if(lastSearchResult.offset <= 0) return;
		const result = app.getCollections('Companies').searchByName(null, {
			offset: lastSearchResult.offset - lastSearchResult.limit,
			limit: lastSearchResult.limit,
			count: true
		});
		setSearchResult(result);
	});

	component.addDOMListener('newCompany', () => {
		app.modalManager.startNew('new/company').then(function(modal){
			modal.on('modalClosed', function(){
				if(modal.result) loadCompanies();
			});
		});
	});

};
