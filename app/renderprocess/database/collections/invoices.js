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
			//require: true
		},
		street: {
			type:String,
			trim: true,
			//require: true
		},
		number: {
			type:String,
			trim: true,
			//require: true
		},
		postalCode: {
			type:String,
			trim: true,
			//require: true
		},
		nation: {
			type:String,
			trim: true,
			//require: true
		}
	}],
	phones: [{
		number:{
			type: String,
			trim: true,
			//require: true
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
		type: Number,
		require: true
	},
	nomineeRef: {
		type: Number,
		//require: true
	},
	creationTime:{
		type: Date,
		default: 'now'
	},
	date: {
		type: Date,
		require: true
	},
	deletedDate: {
		type: Date
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
	issuerHeading:{
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

	newInvoice(invoice, company){
		invoice.nominee = company;
		invoice.issuer = this.user.company;
		invoice.ownerRef = this.user.$loki;
		invoice.nomineeRef = company.$loki;
		try{
			invoice.headerText = this.user.invoiceSetting.headerText;
			invoice.footerText = this.user.invoiceSetting.footerText;
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
		item.imposta = roundDecimals(item.imponibile * item.iva / 100);
		item.totPrice = roundDecimals(item.imponibile + item.imposta);
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

				let imp = impMap.get(item.iva);
				if(!imp){
					impMap.set(item.iva, {
						imposta: item.imposta,
						imponibile: item.imponibile
					});
				}else{
					imp.imponibile += item.imponibile;
					imp.imposta += item.imposta;
					impMap.set(item.iva, imp);
				}
				return item;
			});
		}

		invoice.tot = totImponibile + totImposta;
		invoice.totImponibile = totImponibile;
		invoice.totImposta = totImposta;
		return invoice;
	}

	calcImpArray(invoice, minLength){
		let impMap = new Map();
		minLength = minLength || 3;
		let impArray = [];
		if(invoice.items && invoice.items.length > 0){
			invoice.items.forEach(function(item){
				let imp = impMap.get(item.iva);
				if(!imp){
					impMap.set(item.iva, {
						imposta: item.imposta,
						imponibile: item.imponibile,
						iva: item.iva
					});
				}else{
					imp.imponibile += item.imponibile;
					imp.imposta += item.imposta;
					impMap.set(item.iva, imp);
				}
			});
		}
		impMap.forEach(function(val){
			impArray.push(val);
		});
		if(impArray.length < minLength){
			let missed = minLength - impArray.length;
			for(let i=0;i<missed;i++ ){
				impArray.push({
					imposta: 0,
					imponibile: 0,
					iva: 0
				});
			}
		}
		return impArray;
	}

	insert(invoice){
		return super.insert(invoice);
	}

	getAll(options){
		options = options || {};
		let limit = options.limit || 20;
		let page = options.page || 0;
		let simpleSort = options.simpleSort || 'date';
		let offset = options.offset || (limit * page);
		let countOption = options.count || false;
		let query = { $and: [{ownerRef: this.user.$loki}, {deletedDate: undefined}] };
		if (options.companyID){
			query.$and.push({nomineeRef: Number(options.companyID)});
		}
		let invoices = this.collection.chain().find(query).simplesort(simpleSort)
			.offset(offset)
          	.limit(limit).data();
		let count;
		if(countOption) count = this.collection.count(query);
		return {
			invoices: invoices,
			count: count,
			offset: offset,
			limit: limit
		}
	}

	getById(id){
		return this.get(Number(id));
	}

	logicalDelete(invoice){
		invoice.deletedDate = new Date();
		this.update(invoice);
	}

	hardDelete(invoice){
		this.remove(invoice);
	}

	getNextProgressiveNumber(){
		let currentYear = new Date().getFullYear();
		let currentYearTime = new Date(currentYear).getTime();
		let invoices = this.collection.chain().find({ '$and': [{ownerRef: this.user.$loki }, { date: { '$gt': currentYearTime }}, { deletedDate: null }]}).simplesort('date').data();
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

    setUser(user){
        this._user = user;
    }
    get user(){ return this._user; }

	list(options = {}){
		const limit = options.itemsPerPage || 20;
		const page = options.page?options.page - 1 : 0;
		let compoundsort = [['date', true]];
		const offset = options.offset || (limit * page);
		const query = { '$and': [{ownerRef: this.user.$loki }] };
        if (options.filter && options.filterColumn){
			const filter = {};
			filter[options.filterColumn] = options.filter;
			query.$and.push(filter);
		}
		if(options.sortBy){
			compoundsort = options.sortBy;
		}

		const invoices = this._collection.chain().find(query).compoundsort(compoundsort)
			/*.where(function(obj){
				console.log('"'+obj.name+'"');
				console.log('test: '+new RegExp('bata','ig').test(obj.name));
				return new RegExp('bata','ig').test(obj.name);
			})*/
			.offset(offset)
			.limit(limit)
			.data();
		let count = this._collection.count(query);
		return {
			items: invoices,
			pagination:{
				isLast: offset+limit >= count,
				currentPage: page+1,
				totalItems: count,
				itemsPerPage: limit
			}
		}
	}
}

module.exports = new InvoicesCollection(DB, invoiceModel);
