'use strict';

const {ipcRenderer} = require('electron');

module.exports = function NewInvoice(app, controller){

	let _newInvoice = null;

	function showPDF(){
		ipcRenderer.once('printInvoice-reply', function(event, result){
			if(!result.success){
				alert(result.error.message);
				return;
			}
			let viewerPath = "../../libs/pdfjs/web/viewer.html";
			controller.querySelector('#checkInvoice iframe').src = viewerPath+'?file='+result.outputPath;
		});
		ipcRenderer.send('printInvoice', { invoice: generateInvoice() });
	}

	function clearActiveNavLink(){
		const nav = controller.querySelector('#invoiceNav');
		const items = nav.querySelectorAll('li');
		for(let i=0;i<items.length;i++){
			let item = items[i];
			item.classList.remove('active');
		}
	}

	function generateInvoice(){
		_newInvoice = {};
		const generalInfoComponent = controller.getChildComponent('general-info');
		const nomineeComponent = controller.getChildComponent('nominee');
		const issuerComponent = controller.getChildComponent('issuer');
		const itemsComponent = controller.getChildComponent('items');
		const user = app.getProperty('user');

		const generalData = generalInfoComponent.getData();
		_newInvoice.date = generalData.date;
		_newInvoice.progressiveNumber = generalData.progressiveNumber;
		_newInvoice.payMethod = generalData.paymethod;
		_newInvoice.iban = generalData.iban;
		_newInvoice.bankName = generalData.bankName;
		_newInvoice.issuerHeading = user.invoiceSetting.heading;
		_newInvoice.headerText = user.invoiceSetting.headerText;
		_newInvoice.footerText = user.invoiceSetting.footerText;

		_newInvoice.items = itemsComponent.getItems();
		_newInvoice = app.getCollections('Invoices').newInvoice(_newInvoice, nomineeComponent.getCompany());
		_newInvoice.impArray = app.getCollections('Invoices').calcImpArray(_newInvoice);
		return _newInvoice;
	}

	controller.addDOMListener('checkNavClick', (event, element) => {
		try{
			showPDF();
			clearActiveNavLink();
			element.parentNode.classList.add('active');
			const checkInvoiceElement = controller.querySelector('#checkInvoice');
			const compileInvoiceElement = controller.querySelector('#compileInvoice');
			checkInvoiceElement.style.display = 'inherit';
			compileInvoiceElement.style.display = 'none';
			try{
				controller.querySelector('#emit-btn').style.display = "inherit";
			}catch(e){}
		}catch(e){
			console.log(e.stack);
			alert('Si è verificato un problema nella costruzione della fattura.\nControlla che tutti i campi siano compilati bene.');
		}
	});

	controller.addDOMListener('compileNavClick', (event, element) => {
		clearActiveNavLink();
		element.parentNode.classList.add('active');
		let checkInvoiceElement = controller.querySelector('#checkInvoice');
		let compileInvoiceElement = controller.querySelector('#compileInvoice');
		checkInvoiceElement.style.display = 'none';
		compileInvoiceElement.style.display = 'inherit';
	});

	controller.addDOMListener('saveInvoice', () => {
		if(!_newInvoice){
			alert('Prima controlla che la fattura sia corretta.');
			return;
		}
		try{
			app.getCollections('Invoices').insert(_newInvoice);
		}catch(e){
			alert(e.message);
			console.error(e.stack);
			return;
		}
		app.controllerManager.startNew('dashboard');
	});
};
