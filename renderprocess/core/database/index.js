'use strict';

const DB = require('./lokiDb');

module.exports.DB = DB;

module.exports.Collections = {};
module.exports.Collections.Users = require('./collections/users');
module.exports.Collections.Companies = require('./collections/companies');
module.exports.Collections.Invoices = require('./collections/invoices');

DB.loadDatabase({}, function(result){
	module.exports.Collections.Users.init();
	module.exports.Collections.Companies.init();
	module.exports.Collections.Invoices.init();
});
