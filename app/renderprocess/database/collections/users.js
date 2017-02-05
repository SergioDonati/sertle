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
	email: String,
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

let userModel = new Model({
	username:{
		type: String,
		trim: true,
		require: true
	},
	password: String, // not require for now
	creationTime:{
		type: Date,
		default: 'now'
	},
	email: String,
	default:{
		type: Boolean,
		default: true
	},
	company: companySchema,
	invoiceSetting:{
		heading: String,
		headerText: String,
		footerText: String,
		defaultIBAN: String,
		defaultBankName: String
	}
});

class UsersCollection extends Collection{

	get collectionName(){ return 'users'; }
	get collectionOptions(){ return { unique:['username'], /*autoupdate: true*/ }; }

	initialize(){
		/*this.insert({
			username: 'sergio',
			password: 'prova',
			company: {
				name: 'Donati Sergio',
				piva: 'asdasdasdasd',
				fiscalCode: 'DNTSRG89-------',
				addresses: [{
					city: 'Arbia',
					postalCode: '53041',
					street: 'via Emilia',
					number: 46,
					nation: 'Italia'
				}],
				phones: [{
					number: '3478868449'
				}]
			},
			invoiceSetting: {}
		});*/
	}

	insert(user){
		user.company.ownerRef = '_null';
		return super.insert(user);
	}

	/** FOR FUTURE USE**/
	login(username, password, callback){
		return this.collection.findOne({ '$and': [{username: username}, {password: password}] });
	}

	/** NO LOGIN IS NEED IN LOCAL SO LOAD THE DEFAULT USER**/
	getDefault(){
		return this.collection.findOne({ default: true });
	}
}

module.exports = new UsersCollection(DB, userModel);
