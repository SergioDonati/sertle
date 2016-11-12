'use script';

module.exports = function CompaniesItemList(app, component) {
	let companies = null;
	component.setRelativeViewPath('../list.pug');

	component.addDOMListener('onSelect', (event, element) => {
		const companyId = element.getAttribute('data-company-id');
		let selectedCompany;
		for(let i=0;i<this.companies.length;i++){
			if(this.companies[i].$loki == companyId) selectedCompany = this.companies[i];
		}
        if(selectedCompany){
			this._eventEmitter.emit('companySelected', selectedCompany);
        }else{
            alert('Seleziona un cliente per procedere.');
        }
    }

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

	component.setCompanies(newCompanies){
		component.addRenderLocals('companies', companies);
		companies = newCompanies;
		if(component.rendered) component.refresh(null, true);
	}

};
