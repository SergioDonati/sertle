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
