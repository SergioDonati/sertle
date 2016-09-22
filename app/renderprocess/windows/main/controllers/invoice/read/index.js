'use strict';

const {Controller, app} = require('easyone-electron');
const {ipcRenderer} = require('electron');

module.exports = class ReadInvoice extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }

	get componentsPath(){ return __dirname+'\\components'; }

	init(invoiceId){
		this.addDOMListener('compileNavClick', this.showCompile.bind(this));
		this.addDOMListener('checkNavClick', this.showCheck.bind(this));
		this.addDOMListener('printNavClick', this.print.bind(this));
		this.addDOMListener('deleteInvoice', this.deleteInvoice.bind(this));
		this.invoice = app.getCollections('Invoices').getById(invoiceId);
		this.addRenderLocals('invoice', this.invoice);
	}

	clearActiveNavLink(){
		let nav = this.querySelector('#invoiceNav');
		let items = nav.querySelectorAll('li');
		for(let i=0;i<items.length;i++){
			let item = items[i];
			item.classList.remove('active');
		}
	}

	showTab(name, linkElement){
		this.clearActiveNavLink();
		if(linkElement) linkElement.parentNode.classList.add('active');
		let checkInvoiceElement = this.querySelector('#checkInvoice');
		let compileInvoiceElement = this.querySelector('#compileInvoice');
		if(name=='check'){
			checkInvoiceElement.style.display = 'inherit';
			compileInvoiceElement.style.display = 'none';
		}else{
			checkInvoiceElement.style.display = 'none';
			compileInvoiceElement.style.display = 'inherit';
		}
	}

	showCheck(event, element){
		this.invoice.impArray = app.getCollections('Invoices').calcImpArray(this.invoice);
		this.showPDF();
		this.showTab('check', element);
	}

	showCompile(event, element){
		this.showTab('compile', element)
	}

	showPDF(){
		let self = this;
		if(this.pdfGenerated) return;
		ipcRenderer.once('printInvoice-reply', function(event, result){
			if(!result.success){
				alert(result.error.message);
				return;
			}
			self.pdfGenerated = true;
			let viewerPath = "../../libs/pdfjs/web/viewer.html";
			self.querySelector('#checkInvoice iframe').src = viewerPath+'?file='+result.outputPath;
		});
		ipcRenderer.send('printInvoice', { invoice: self.invoice });
	}

	print(){
		this.invoice.impArray = app.getCollections('Invoices').calcImpArray(this.invoice);
		ipcRenderer.once('printInvoiceF-reply', function(event, result){
			if(!result.success){
				console.log('error: '+require('util').inspect(result, { depth: null }));
				alert(result.error.message);
				return;
			}
			console.log('Realy printed.');
		});
		ipcRenderer.send('printInvoiceF', { invoice: this.invoice });
	}

	deleteInvoice(){
		app.modalManager.startNew('delete/invoice', this.invoice);
	}
};
