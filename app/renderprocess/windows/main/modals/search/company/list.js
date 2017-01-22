'use script';

module.exports = function CompaniesItemList(app, component) {
	let companies = null;
	component.setRelativeViewPath('../list.pug');

	component.addDOMListener('onSelect', (event, element) => {
		const companyId = element.getAttribute('data-company-id');
		let selectedCompany;
		if(!companies) return;
		for(let i=0;i<companies.length;i++){
			if(companies[i].$loki == companyId) selectedCompany = companies[i];
		}
        if(selectedCompany){
			component._eventEmitter.emit('companySelected', selectedCompany);
        }else{
            alert('Seleziona un cliente per procedere.');
        }
    });

	function unselectAllRows(){
        const rows = component.querySelectorAll('table tr');
        for(let i=0;i<rows.length;i++){
            let row = rows[i];
            row.classList.remove('row-selected');
        };
    }

	component.addDOMListener('rowClick', (event, row) => {
		if(row.classList.contains('row-selected')){
			row.classList.remove('row-selected');
		}else{
			unselectAllRows();
			row.classList.add('row-selected');
		}
	});

	component.setCompanies = function(newCompanies){
		companies = newCompanies;
		component.addRenderLocals('companies', companies);
		if(component.rendered) component.refresh(null, true);
	}

};
