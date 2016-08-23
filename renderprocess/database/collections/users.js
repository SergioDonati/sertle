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

let userModel = new Model({
	username:{
		type: String,
		trim: true,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	creationTime:{
		type: Date,
		default: 'now'
	},
	company: companySchema,
	invoiceSetting:{
		headerText: String,
		footerText: String
	}
});

class UsersCollection extends Collection{

	get collectionName(){ return 'users'; }
	get collectionOptions(){ return { unique:['username'], /*autoupdate: true*/ }; }

	initialize(){
		this.insert({
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
					number: '3478868449',
					description: null
				}]
			}
		});
	}

	inset(user){
		user.company.ownerRef = '_null';
		return super.insert(user);
	}

	login(username, password, callback){
		return this.collection.findOne({ username: username, password: password });
	}
}

module.exports = new UsersCollection(DB, userModel);
