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
		this.addDOMListener('saveInvoice', this.saveInvoice.bind(this));
	}

	clearActiveNavLink(){
		let nav = this.querySelector('#invoiceNav');
		let items = nav.querySelectorAll('li');
		for(let i=0;i<items.length;i++){
			let item = items[i];
			item.classList.remove('active');
		}
	}

	generateInvoice(){
		this._newInvoice = {};
		let generalInfoComponent = this.getChildComponent('general-info');
		let nomineeComponent = this.getChildComponent('nominee');
		let issuerComponent = this.getChildComponent('issuer');
		let itemsComponent = this.getChildComponent('items');
		const user = app.getProperty('user');

		let generalData = generalInfoComponent.getData();
		this._newInvoice.date = generalData.date;
		this._newInvoice.progressiveNumber = generalData.progressiveNumber;
		this._newInvoice.payMethod = generalData.paymethod;
		this._newInvoice.iban = generalData.iban;
		this._newInvoice.bankName = generalData.bankName;
		this._newInvoice.issuerHeading = user.invoiceSetting.heading;
		this._newInvoice.headerText = user.invoiceSetting.headerText;
		this._newInvoice.footerText = user.invoiceSetting.footerText;

		this._newInvoice.items = itemsComponent.getItems();
		this._newInvoice = app.getCollections('Invoices').newInvoice(this._newInvoice, nomineeComponent.company);
		this._newInvoice.impArray = app.getCollections('Invoices').calcImpArray(this._newInvoice);
		return this._newInvoice;
	}

	showCheck(event, element){
		try{
			this.showPDF();
			this.clearActiveNavLink();
			element.parentNode.classList.add('active');
			let checkInvoiceElement = this.querySelector('#checkInvoice');
			let compileInvoiceElement = this.querySelector('#compileInvoice');
			checkInvoiceElement.style.display = 'inherit';
			compileInvoiceElement.style.display = 'none';
			try{
				this.querySelector('#emit-btn').style.display = "inherit";
			}catch(e){}
		}catch(e){
			console.log(e.stack);
			alert('Si è verificato un problema nella costruzione della fattura.\nControlla che tutti i campi siano compilati bene.');
		}
	}

	showCompile(event, element){
		this.clearActiveNavLink();
		element.parentNode.classList.add('active');
		let checkInvoiceElement = this.querySelector('#checkInvoice');
		let compileInvoiceElement = this.querySelector('#compileInvoice');
		checkInvoiceElement.style.display = 'none';
		compileInvoiceElement.style.display = 'inherit';
	}

	showPDF(){
		let self = this;
		ipcRenderer.once('printInvoice-reply', function(event, result){
			if(!result.success){
				alert(result.error.message);
				return;
			}
			let viewerPath = "../../libs/pdfjs/web/viewer.html";
			self.querySelector('#checkInvoice iframe').src = viewerPath+'?file='+result.outputPath;
		});
		ipcRenderer.send('printInvoice', { invoice: self.generateInvoice() });
	}

	saveInvoice(){
		let self = this;
		if(!this._newInvoice){
			alert('Prima controlla che la fattura sia corretta.');
			return;
		}
		try{
			app.getCollections('Invoices').insert(this._newInvoice);
		}catch(e){
			alert(e.message);
			console.error(e.stack);
			return;
		}
		app.controllerManager.startNew('dashboard');
	}
};
