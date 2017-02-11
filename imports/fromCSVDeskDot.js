'use strict';

const csv = require('csv-parser');
const fs = require('fs');

const lokijs = require('lokijs');
const lokiDB = new lokijs('imported.db', {autosave:false});
const Company = require('../app/renderprocess/database/collections/companies');
Company._db = lokiDB;
const Invoice = require('../app/renderprocess/database/collections/invoices');
Invoice._db = lokiDB;
const User = require('../app/renderprocess/database/collections/users');
User._db = lokiDB;

let saveQueued = false;

function throttleSave() {
	if (saveQueued) return;

	saveQueued = true;

	setTimeout(function() {
		try{
			lokiDB.saveDatabase(function(err) {
				console.log('save completed');
				saveQueued = false;
			});
		}catch(e){
			console.error(e);
		}
	}, 1000);
}

fs.unlinkSync('./imported.db');

lokiDB.loadDatabase({}, function(result){
	User.init();
	Company.init();
	Invoice.init();

	const user = User.insert({
		username: 'tappezzeria',
		//password: '12345678',
		default: true,
		email: 'tappezzeriadmg@gmail.it',
		company: {
			name: 'Tappezzeria D.M.G.',
			piva: '00914260526',
			fiscalCode: 'DNTRRT64S16F676L',
			email: 'tappezzeriadmg@gmail.it',
			addresses: [{
				city: 'Siena',
				postalCode: '53100',
				street: 'Via Aretina',
				number: 92,
				nation: 'Italia'
			}],
			phones: [{
				number: '0577223623'
			}]
		},
		invoiceSetting: {
			heading: 'di DONATI ROBERTO',
			footerText: 'Contributo ambientale CO.NA.I. assolto.'
		}
	});

	const userRef= user.$loki;

	if(!userRef){
		console.log('User no defined');
		return;
	}

	Company.setUser(user);
	Invoice.setUser(user);

	const loadEntities = function(){
		return new Promise(function(resolve, reject){
			const entities = new Map();
			fs.createReadStream('./imports/files/Entity.csv')
			.pipe(csv())
			.on('data', function (data) {
				entities.set(data.ID, {
					ownerRef: userRef,
					name: data.Name,
					piva: data.Piva,
					fiscalCode: data.FiscalCode,
					addresses: [],
					phones: []
				});
			}).on('end', function(){
				resolve(entities);
			});
		});
	}

	const loadAddresses = function(entities){
		return new Promise(function(resolve, reject){
			fs.createReadStream('./imports/files/Address.csv')
			.pipe(csv())
			.on('data', function (data) {
				if(!entities.has(data.EntitiID)) return;

				entities.get(data.EntitiID).addresses.push({
					city: data.City,
					nation: data.Nation,
					postalCode: data.PostalCode,
					number: data.Number,
					nation: 'Italia',
					street: data.Street
				});
			}).on('end', function(){
				resolve(entities);
			});
		});
	}

	const loadPhones = function(entities){
		return new Promise(function(resolve, reject){
			fs.createReadStream('./imports/files/Phone.csv')
			.pipe(csv())
			.on('data', function (data) {
				if(!entities.has(data.EntitiID)) return;
				entities.get(data.EntitiID).phones.push({
					number: data.Number
				});
			}).on('end', function(){
				resolve(entities);
			});
		});
	}

	const loadInvoices = function(companies){
		const invoices = new Map();
		return new Promise(function(resolve, reject){
			fs.createReadStream('./imports/files/Invoice.csv')
			.pipe(csv())
			.on('data', function (data) {

				const invoice = {
					ownerRef: userRef,
					date: data.Date,
					deletedDate: data.DeletedDate,
					tot: data.Tot,
					totImponibile: data.TotImponibile,
					totImposta: data.TotImposta,
					payMethod: data.PayMethod,
					currency: 'EUR',
					iban: data.IBAN,
					bankName: data.BankName,
					issuerHeading: data.HeaderIssuerNameText,
					headerText: data.HeaderText,
					footerText: data.FooterText,
					progressiveNumber: data.ProgressiveNumber,
					issuer: user.company,
					items: []
				};
				if(!companies.has(data.NomineeID)){
					console.log(data.ID+' invoice no have entity ');
					invoice.nomineeRef = '_';
					invoice.nominee = {
						name: data.NomineeName,
						piva: data.NomineePiva,
						fiscalCode: data.NomineeFiscalCode,
						addresses: [{
							city: data.NomineeAddressCity,
							street: data.NomineeAddressStreet,
							number: data.NomineeAddressNumber,
							postalCode: data.NomineeAddressPostalCode,
							nation: 'Italia'
						}],
						phones: [{
							number: data.NomineePhone
						}]
					};
				}else{
					invoice.nomineeRef = companies.get(data.NomineeID).$loki;
					invoice.nominee = companies.get(data.NomineeID);
				}
				invoices.set(data.ID, invoice);
			}).on('end', function(){
				resolve(invoices);
			});
		});
	}

	const loadInvoiceItems = function(invoices){
		return new Promise(function(resolve, reject){
			fs.createReadStream('./imports/files/InvoiceItem.csv')
			.pipe(csv())
			.on('data', function (data) {
				if(!invoices.has(data.InvoiceID)){
					console.log(data.ID+' invoice item no have invoice ');
					return;
				}
				invoices.get(data.InvoiceID).items.push({
					description: data.Description,
					name: data.Name,
					code: data.Code,
					unit:data.Unit || 'nr',
					price: data.Price,
					quantity: data.Quantity,
					iva: data.Iva,
					discount: data.Discount,
					imponibile: data.Imponibile,
					imposta: data.Imposta,
					totPrice: data.TotPrice
				});
			}).on('end', function(){
				resolve(invoices);
			});
		});
	}

	loadEntities().then(loadAddresses).then(loadPhones).then(function(entities){
		//console.log(require('util').inspect(entities, { depth: null }));
		let w = new Promise(function(resolve){resolve();});
		entities.forEach(function(val, key, map){
			w = w.then(function(){
				return new Promise(function(resolve){
					setTimeout(function(){
						console.error('save company');
						const e = Company.insert(val);
						if(!e || typeof e.$loki == 'undefined'){
							console.error('entity not defined');
							return;
						}
						map.set(key, e);
						//throttleSave();
						resolve();
					}, 500);
				});
			});
		});
		return w.then(function(){
			console.log('\nCompany SAVED\n');
			return new Promise(function(resolve){
				resolve(entities);
				/*setTimeout(function(){
					console.log('\ntimeout waited\n');
					lokiDB.loadDatabase({}, function(){
						resolve(entities);
					});
				}, 1000);*/
			});
		});
	})
	.then(loadInvoices).then(loadInvoiceItems).then(function(invoices){
		console.log('\nSAVE INVOICES\n');
		let w = new Promise(function(resolve){resolve();});
		invoices.forEach(function(val, key, map){
			w = w.then(function(){
				return new Promise(function(resolve){
					setTimeout(function(){
						console.error('save invoice');
						const e = Invoice.insert(val);
						if(!e || typeof e.$loki == 'undefined'){
							console.error('invoice not defined');
							return;
						}
						map.set(key, e);
						throttleSave();
						resolve();
					}, 1500);
				});
			});
		});

		return w.then(function(){
			console.log('\nSAVED\n');
			return new Promise(function(resolve){
				setTimeout(function(){
					throttleSave();
					setTimeout(function(){
						resolve();
					}, 10000);
				}, 1000);
			}).then(function(){
				process.exit(1);
			});
		});
	}).catch(function(e){
		console.error(e);
		process.exit(1);
	});
});
