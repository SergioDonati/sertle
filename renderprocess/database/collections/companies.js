'use strict';

const DB = require('../lokiDb');
const Model = require('../lokiModel');
const Collection = require('../lokiCollection');

let companyModel = new Model({
	ownerRef: {
		type: String,
		require: true
	},
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
	creationTime: {
		type: Date,
		default: 'now'
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
		description: String,
		number:{
			type: String,
			trim: true,
			require: true
		}
	}]
});

class CompaniesCollection extends Collection{
	get collectionName(){ return 'companies'; }
	get collectionOptions(){ return { /*autoupdate: true*/ }; }

	insert(company, user){
		company.ownerRef = user.$loki;
		return super.insert(company);
	}

	getAll(){
		let companies = this.find({});
		this._count = companies.length;
		return companies;
	}

	count(){
		this.getAll();
		return this._count;
	}

	searchByName(name, options){
		options = options || {};
		let limit = options.limit || 20;
		let simpleSort = options.simpleSort || 'name';
		let offset = options.offset || 0;
		let countOption = options.count || false;
		let query = { 'name': { '$regex': [name, 'i'] } };
		let companies = this._collection.chain().find(query).simplesort(simpleSort)
			.offset(offset)
          	.limit(limit).data();
		let count;
		if(countOption) count = this._collection.count(query);
		return {
			companies: companies,
			count: count
		}
	}
}

module.exports = new CompaniesCollection(DB, companyModel);
