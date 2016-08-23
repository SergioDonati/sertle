'use strict';

const {Controller, app} = require('easyone-electron');
const {ipcRenderer} = require('electron');

module.exports = class NewInvoice extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }

	get componentsPath(){ return __dirname+'\\components'; }

	init(){
		this.addDOMListener('compileNavClick', this.showCompile.bind(this));
		this.addDOMListener('checkNavClick', this.showCheck.bind(this));
	}

	clearActiveNavLink(){
		let nav = this.HTMLElement.querySelector('#invoiceNav');
		let items = nav.querySelectorAll('li');
		for(let i=0;i<items.length;i++){
			let item = items[i];
			item.classList.remove('active');
		}
	}

	generateInvoice(){
		let newInvoice = {};
		let generalInfoComponent = this.getChildComponent('general-info');
		let nomineeComponent = this.getChildComponent('nominee');
		let issuerComponent = this.getChildComponent('issuer');
		let itemsComponent = this.getChildComponent('items');

		let generalData = generalInfoComponent.getData();
		newInvoice.date = generalData.date;
		newInvoice.progressiveNumber = generalData.progressiveNumber;
		newInvoice.payMethod = generalData.paymethod;
		newInvoice.iban = generalData.iban;

		newInvoice.items = itemsComponent.getItems();
		newInvoice = app.getCollections('Invoices').newInvoice(newInvoice, app.getProperty('user'), nomineeComponent.company);
		//console.log(require('util').inspect(newInvoice, { depth: null }));
		return newInvoice;
	}

	showCheck(event, element){
		try{
			//this.generateInvoice();
			this.showPDF();
			this.clearActiveNavLink();
			element.parentNode.classList.add('active');
			let checkInvoiceElement = this.HTMLElement.querySelector('#checkInvoice');
			let compileInvoiceElement = this.HTMLElement.querySelector('#compileInvoice');
			checkInvoiceElement.style.display = 'inherit';
			compileInvoiceElement.style.display = 'none';
		}catch(e){
			console.log(e.stack);
			alert('Si è verificato un problema nella costruzione della fattura.\nControlla che tutti i campi siano compilati bene.');
		}
	}

	showCompile(event, element){
		this.clearActiveNavLink();
		element.parentNode.classList.add('active');
		let checkInvoiceElement = this.HTMLElement.querySelector('#checkInvoice');
		let compileInvoiceElement = this.HTMLElement.querySelector('#compileInvoice');
		checkInvoiceElement.style.display = 'none';
		compileInvoiceElement.style.display = 'inherit';
	}

	showPDF(){
		let self = this;
		ipcRenderer.send('printInvoice', {invoice: this.generateInvoice() });
		ipcRenderer.on('printInvoice-reply', function(event, result){
			console.log(require('util').inspect(result, { depth: null }));
			if(!result.success){
				alert(result.error.message);
				return;
			}
			let viewerPath = "../../libs/pdfjs/web/viewer.html";
			self.querySelector('#checkInvoice iframe').src = viewerPath+'?file='+result.outputPath;
		});

	}
};
