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
	get collectionOptions(){ return { /*autoupdate: true*/clone: true }; }

	insert(company){
		company.ownerRef = this.user.$loki;
		return super.insert(company);
	}

	getAll(){
		return this.find({ownerRef: this.user.$loki});
	}

	count(){
		return this._collection.count({ownerRef: this.user.$loki});
	}

	searchByName(name, options){
		options = options || {};
		const limit = options.limit || 20;
		const page = options.page || 0;
		const simpleSort = options.simpleSort || 'name';
		const offset = options.offset || (limit * page);
		const countOption = options.count || false;
		const query = { '$and': [{ownerRef: this.user.$loki }] };
        if (name && name.length>0) query.$and.push({ 'name': { '$regex': [name, 'i'] } });
		const companies = this._collection.chain().find(query).simplesort(simpleSort)
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

	setUser(user){ this._user = user; }
	get user(){ return this._user; }

	list(options = {}){
		const limit = options.itemsPerPage || 20;
		const page = options.page?options.page - 1 : 0;
		const simpleSort = options.sortBy || 'name';
		const offset = options.offset || (limit * page);
		const query = { '$and': [{ownerRef: this.user.$loki }] };
        if (options.filter && options.filterColumn){
			const filter = {};
			filter[options.filterColumn] = options.filter;
			query.$and.push(filter);
		}

		const companies = this._collection.chain().find(query).simplesort(simpleSort)
			.offset(offset)
			.limit(limit)
			.data();
		const count = this._collection.count(query);
		return {
			items: companies,
			pagination:{
				isLast: offset+limit >= count,
				currentPage: page+1,
				totalItems: count,
				itemsPerPage: limit
			}
		}
	}

	newCompany(company){
		company.ownerRef = this.user.$loki;
		const result = this.validate(invoice);
		if(result.valid != true){
			throw result.error;
		}
		return this._model.newDocument(company);
	}
}

module.exports = new CompaniesCollection(DB, companyModel);
