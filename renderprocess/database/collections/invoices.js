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
	discount: Number
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
	date: {
		type: String,
		require: true
	},
	tot: {
		type: String,
		require: true
	},
	totImponibile: {
		type: String,
		require: true
	},
	totImposta: {
		type: String,
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
	progressivenumber:{
		type: Number,
		require: true
	},
	issuer: companySchema,
	nominee: companySchema,
	items: invoiceItemSchema
});

class InvoicesCollection extends Collection{

	get collectionName(){ return 'invoices'; }
	get collectionOptions(){ return { autoupdate: true }; }

	insert(invoice, user, company){
		invoice.nominee = company;
		invoice.issuer = user.company;
		invoice.ownerRef = user.$loki;
		invoice.nomineeRef = company.$loki;
		return super.insert(invoice);
	}

	getAll(user){
		return this.find({ userRef: user.$loki });
	}

	validate(invoice){
		return this.model.valid(invoice);
	}

	validateItem(item){
		return invoiceItemModel.valid(item);
	}
}

module.exports = new InvoicesCollection(DB, invoiceModel);
