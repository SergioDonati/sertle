'use strict';

const {ipcRenderer} = require('electron');

module.exports = function ReadInvoice(app, component, invoiceId) {

	const invoice = app.getCollections('Invoices').getById(invoiceId);
	let pdfGenerated = false;

	component.addRenderLocals('invoice', invoice);

	function showPDF(){
		if(pdfGenerated) return;
		ipcRenderer.once('printInvoice-reply', function(event, result){
			if(!result.success){
				alert(result.error.message);
				return;
			}
			pdfGenerated = true;
			let viewerPath = "../../libs/pdfjs/web/viewer.html";
			component.querySelector('#checkInvoice iframe').src = viewerPath+'?file='+result.outputPath;
		});
		ipcRenderer.send('printInvoice', { invoice: invoice });
	}

	function clearActiveNavLink(){
		const nav = component.querySelector('#invoiceNav');
		const items = nav.querySelectorAll('li');
		for(let i=0;i<items.length;i++){
			let item = items[i];
			item.classList.remove('active');
		}
	}

	function showTab(name, linkElement){
		clearActiveNavLink();
		if(linkElement) linkElement.parentNode.classList.add('active');
		const checkInvoiceElement = component.querySelector('#checkInvoice');
		const compileInvoiceElement = component.querySelector('#compileInvoice');
		if(name=='check'){
			checkInvoiceElement.style.display = 'inherit';
			compileInvoiceElement.style.display = 'none';
		}else{
			checkInvoiceElement.style.display = 'none';
			compileInvoiceElement.style.display = 'inherit';
		}
	}

	component.addDOMListener('checkNavClick', (event, element) => {
		invoice.impArray = app.getCollections('Invoices').calcImpArray(invoice);
		showPDF();
		showTab('check', element);
	});

	component.addDOMListener('compileNavClick', (event, element) => {
		showTab('compile', element)
	});

	component.addDOMListener('printNavClick', () => {
		invoice.impArray = app.getCollections('Invoices').calcImpArray(invoice);
		ipcRenderer.once('printInvoiceF-reply', function(event, result){
			if(!result.success){
				console.log('error: '+require('util').inspect(result, { depth: null }));
				alert(result.error.message);
				return;
			}
			console.log('Realy printed.');
		});
		ipcRenderer.send('printInvoiceF', { invoice: invoice });
	});

	component.addDOMListener('deleteInvoice', () => {
		app.modalManager.startNew('delete/invoice', invoice);
	});
};
