'use strict';

const DB = require('../lokiDb');
const Model = require('../lokiModel');
const Collection = require('../lokiCollection');

let companySchema = {
	name: {
		type: String,
		trim: true,
		require: true
	},
	piva: {
		type: String,
		lowercase: true,
		trim: true
	},
	fiscalCode: {
		type:String,
		lowercase:true,
		trim: true
	},
	addresses: [{
		city: {
			type:String,
			trim: true,
			require: true
		},
		street: {
			type:String,
			trim: true,
			require: true
		},
		number: {
			type:String,
			trim: true,
			require: true
		},
		postalCode: {
			type:String,
			trim: true,
			require: true
		},
		nation: {
			type:String,
			trim: true,
			require: true
		}
	}],
	phones: [{
		number:{
			type: String,
			trim: true,
			require: true
		}
	}]
};

let invoiceItemSchema = {
	description: {
		type: String,
		require: true
	},
	name: {
		type:String,
		trim: true
	},
	code: String,
	unit:{
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: true
	},
	quantity: {
		type: Number,
		require: true
	},
	iva: {
		type: Number,
		require: true
	},
	discount: Number,
	imponibile: {
		type: Number,
		require: true
	},
	imposta: {
		type: Number,
		require: true
	},
	totPrice: {
		type: Number,
		require: true
	}
};

let invoiceItemModel = new Model(invoiceItemSchema);

let invoiceModel = new Model({
	ownerRef: {
		type: String,
		require: true
	},
	nomineeRef: {
		type: String,
		require: true
	},
	creationTime:{
		type: Date,
		default: 'now'
	},
	date: {
		type: Date,
		require: true
	},
	tot: {
		type: Number,
		require: true
	},
	totImponibile: {
		type: Number,
		require: true
	},
	totImposta: {
		type: Number,
		require: true
	},
	payMethod: {
		type: String,
		trim: true,
		lowercase: true,
		require: true
	},
	currency: {
		type: String,
		default: 'EUR'
	},
	iban:{
		type: String,
		trim: true
	},
	bankName:{
		type: String,
		trim: true
	},
	headerText:{
		type: String,
		trim: true
	},
	footerText:{
		type: String,
		trim: true
	},
	progressiveNumber:{
		type: Number,
		require: true
	},
	issuer: companySchema,
	nominee: companySchema,
	items: [invoiceItemSchema]
});

function roundDecimals(num){
	return Math.round(num * 100) / 100;
}

class InvoicesCollection extends Collection{

	get collectionName(){ return 'invoices'; }
	get collectionOptions(){ return { /*autoupdate: true*/ }; }

	newInvoice(invoice, user, company){
		invoice.nominee = company;
		invoice.issuer = user.company;
		invoice.ownerRef = user.$loki;
		invoice.nomineeRef = company.$loki;
		try{
			invoice.headerText = user.invoiceSetting.headerText;
			invoice.footerText = user.invoiceSetting.footerText;
		}catch(e){}
		invoice = InvoicesCollection.calc(invoice);
		let result = this.validate(invoice);
		if(result.valid != true){
			throw result.error;
		}
		return this._model.newDocument(invoice);
	}

	static calcItem(item){
		item.imponibile = roundDecimals(item.price * item.quantity);
		item.imposta = roundDecimals(imponibile * item.iva / 100);
		item.totPrice = roundDecimals(imponibile + imposta);
		return item;
	}

	static calc(invoice){
		let impMap = new Map();
		let totImponibile = 0;
		let totImposta = 0;
		if(invoice.items && invoice.items.length > 0){
			invoice.items = invoice.items.map(function(item){
				item = InvoicesCollection.calcItem(item);
				totImposta += item.imposta;
				totImponibile += item.imponibile;
			});
		}

		invoice.tot = totImponibile + totImposta;
		invoice.totImponibile = totImponibile;
		invoice.totImposta = totImposta;
		return invoice;
	}

	insert(invoice){
		return super.insert(invoice);
	}

	getAll(user){
		return this.find({ userRef: user.$loki });
	}

	getNextProgressiveNumber(user){
		let currentYear = new Date().getFullYear();
		let currentYearTime = new Date(currentYear).getTime();
		let invoices = this._collection.chain().find({ userRef: user.$loki, date: { '$gt': currentYearTime } }).simplesort('date').data();
		let nextProgressiveNumber = 1;
		if(invoices.length == 0) return 1;
		let lastInvoice = invoices[invoices.length-1];
		return lastInvoice.progressiveNumber + 1;
	}

	validate(invoice){
		return this.model.valid(invoice);
	}

	validateItem(item){
		return invoiceItemModel.valid(item);
	}
}

module.exports = new InvoicesCollection(DB, invoiceModel);
