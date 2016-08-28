'use script';

const {Component, app} = require('easyone-electron');

module.exports = class CompaniesItemList extends Component {

	get viewPath(){ return __dirname+'\\list.pug'; }

	init(){
		this.addDOMListener('onSelect', this.select.bind(this));
		this.addDOMListener('rowClick', this.selectRow.bind(this));
	}

	select(event, element){
		let companyId = element.getAttribute('data-company-id');
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

	unselectAllRows(){
        let rows = this.querySelectorAll('table tr');
        for(let i=0;i<rows.length;i++){
            let row = rows[i];
            row.classList.remove('row-selected');
        };
    }

	selectRow(event, row){
		if(row.classList.contains('row-selected')){
			row.classList.remove('row-selected');
		}else{
			this.unselectAllRows();
			row.classList.add('row-selected');
		}
	}

	setCompanies(companies){
		this.addRenderLocals('companies', companies);
		this.companies = companies;
		if(this.rendered) this.refresh(null, true);
	}

};
