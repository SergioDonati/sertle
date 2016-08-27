'use strict';

const {Modal,  app} = require('easyone-electron');

module.exports = class NewCompany extends Modal{

	get viewPath(){ return __dirname+'\\view.pug'; }
    get stylePath(){ return __dirname+'\\style.less'; }
    get componentsPath(){ return __dirname; }

    get companiesPerPage(){ return 10; }

	init(){
        this.companiesMap = new WeakMap();
		this.addDOMListener('onSubmit', this.search.bind(this));
        this.addDOMListener('onSelect', this.select.bind(this));
        this.on('rendered', function(){
			this.itemsTable = this.querySelector('#companies-table');
            this.itemsTableBody = this.querySelector('tbody');
            this.search();
		});
	}

    unselectAll(){
        let rows = this.itemsTableBody.rows;
        for(let i=0;i<rows.length;i++){
            let row = rows[i];
            row.classList.remove('row-selected');
        };
    }

    _insertCell(row, value){
		let newCell = row.insertCell();
		try{
  			if(value) newCell.appendChild(document.createTextNode(value));
		}catch(e){
			console.warn(e);
		}
	}

	_insertRow(item){
		let newRow = this.itemsTableBody.insertRow();

		this._insertCell(newRow, item.name);
		this._insertCell(newRow, item.piva);
		this._insertCell(newRow, item.fiscalCode);

        this.companiesMap.set(newRow, item);
        let self = this;
        newRow.addEventListener('click', function(){
            self.unselectAll();
            if(self._selectedCompany == self.companiesMap.get(newRow)){
                self._selectedCompany = null;
                //newRow.classList.remove('row-selected');
            }else{
                self._selectedCompany = self.companiesMap.get(newRow);
                newRow.classList.add('row-selected');
            }
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

    clearResult(){
        for(let i=0;i<this.itemsTableBody.rows.length;i++){
            this.itemsTableBody.deleteRow();
        }
    }

    previousPage(){
        if(this.pageResult == 1) return;
        this.clearResult();
        this.pageResult--;
        let offset = this.companiesPerPage * this.pageResult;
        let companies = app.getCollections('Companies').searchByName(searchKey, { limit: this.companiesPerPage, offset: offset });
        for(let i=0;i<companies.length;i++){
            this._insertRow(companies[i]);
        }
    }

    fillTable(list){
        this.companiesMap = new WeakMap();
        for(let i=0;i<list.length;i++){
            this._insertRow(list[i]);
        }
    }

    nextPage(){
        let offset = this.companiesPerPage * (this.pageResult+1);
        if(offset > this.searchCount) return;


        let result = app.getCollections('Companies').searchByName(searchKey, { limit: this.companiesPerPage, offset: offset });
        this.fillTable(result.companies);
        this.pageResult++;
    }

	search(){
		let searchInput = this.querySelector('#searchInput');
		let searchKey = searchInput.value.trim();

        this.clearResult();

        let result = app.getCollections('Companies').searchByName(searchKey, { limit: this.companiesPerPage, count: true });
        this.fillTable(result.companies);
        this.searchCount = result.count;
        this.pageResult = 1;
    }
}
