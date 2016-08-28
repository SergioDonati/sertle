'use strict';

const DB = require('../lokiDb');
const Model = require('../lokiModel');
const Collection = require('../lokiCollection');

let companyModel = new Model({
	ownerRef: {
		type: Number,
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

	insert(company){
		company.ownerRef = this.user.$loki;
		return super.insert(company);
	}

	getAll(){
		return this.find({ownerRef: this.user.$loki});
	}

	count(){
		return this._collection.count({});
	}

	searchByName(name, options){
		options = options || {};
		let limit = options.limit || 20;
		let page = options.page || 0;
		let simpleSort = options.simpleSort || 'name';
		let offset = options.offset || (limit * page);
		let countOption = options.count || false;
		let query = { '$and': [{ownerRef: this.user.$loki }] };
        if (name) query.$and.push({ 'name': { '$regex': [name, 'i'] } });
		let companies = this._collection.chain().find(query).simplesort(simpleSort)
			.offset(offset)
          	.limit(limit).data();
		let count;
		if(countOption) count = this._collection.count(query);
		return {
			companies: companies,
			count: count,
			offset: offset,
			limit: limit
		}
	}

    setUser(user){
        this._user = user;
    }
    get user(){ return this._user; }
}

module.exports = new CompaniesCollection(DB, companyModel);
