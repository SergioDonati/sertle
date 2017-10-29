'use strict';

const { DB, onReady, setUser, Collections } = require('../../app/renderprocess/database');

const Users = Collections['Users'];
const Companies = Collections['Companies'];
const Invoices = Collections['Invoices'];

const ready = new Promise(function(resolve){
	onReady(db =>{
		setUser(Users.getDefault());
		resolve(db);
	});
});

function caller(fun){
	return function(...args){
		return ready.then(()=>{
			return new Promise(function(resolve, reject){
				fun(resolve, reject, ...args)
			}).then(result =>{
				return { data: result, success:true };
			});
		});
	};
}

module.exports.getCompaniesCount = caller(function(res, rej){
	res(Companies.count());
});

module.exports.getCompanies = caller(function(res, rej, options){
	res(Companies.list(options));
});

module.exports.getCompany = caller(function(res, rej, id){
	res(Companies.get(id));
});

module.exports.updateCompanyField = caller(function(res, rej, id, data){
	const company = Companies.get(id);
	company[data.fieldName] = data.newValue;
	res(Companies.update(company));
});

module.exports.updateCompanyAddress = caller(function(res, rej, company_id, address_index, address){
	const company = Companies.get(company_id);
	if(typeof company.addresses[address_index] == 'undefined'){
		return rej(new Error('Address not found.'));
	}
	company.addresses[address_index] = address;
	res(Companies.update(company));
});

module.exports.addCompanyAddress = caller(function(res, rej, company_id, address){
	const company = Companies.get(company_id);
	company.addresses.push(address);
	res(Companies.update(company));
});

module.exports.updateCompanyPhone = caller(function(res, rej, company_id, phone_index, phone){
	const company = Companies.get(company_id);
	if(typeof company.phones[phone_index] == 'undefined'){
		return rej(new Error('Phone not found.'));
	}
	company.phones[phone_index] = phone;
	res(Companies.update(company));
});

module.exports.addCompanyPhone = caller(function(res, rej, company_id, phone){
	const company = Companies.get(company_id);
	company.phones.push(phone);
	res(Companies.update(company));
});

module.exports.getInvoices = caller(function(res, rej, options){
	res(Invoices.list(options));
});

module.exports.getInvoice = caller(function(res, rej, id){
	res(Invoices.get(id));
});

module.exports.getInvoicesCount = caller(function(res, rej){
	res(Invoices.count());
});

module.exports.recalcInvoice = caller(function(res, rej, invoice){
	res(Invoices.calc(invoice));
});

module.exports.recalcInvoiceItem = caller(function(res, rej, invoiceItem){
	res(Invoices.calcItem(invoiceItem));
});

module.exports.updateInvoice = caller(function(res, rej, invoice){
	module.exports.recalcInvoice(invoice).then((response)=>{
		res(Invoices.update(response.data));
	});
});

module.exports.createInvoice = caller(function(res, rej, invoiceData, companyData){
	res(Invoices.newInvoice(invoiceData, companyData));
});

module.exports.createCompany = caller(function(res, rej, companyData){
	res(Companies.newCompany(companyData));
});

module.exports.getEmptyInvoice = caller(function(res, rej){
	res(Invoices.getEmptyInvoice());
});
