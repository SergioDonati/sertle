'use strict';

const DB = require('./lokiDb');

module.exports.DB = DB;

module.exports.Collections = {};
module.exports.Collections.Users = require('./collections/users');
module.exports.Collections.Companies = require('./collections/companies');
module.exports.Collections.Invoices = require('./collections/invoices');

let ready = false;
let listeners = new Set();

module.exports.onReady = function(listener){
	if (ready) listener(DB);
	else listeners.add(listener);
};

// Register user after login
module.exports.setUser = function(user){
    let set = function (){
        module.exports.Collections.Companies.setUser(user);
        module.exports.Collections.Invoices.setUser(user);
    }
    if (ready) set();
    else listeners.add(set);
}

DB.loadDatabase({}, function(result){
	module.exports.Collections.Users.init();
	module.exports.Collections.Companies.init();
	module.exports.Collections.Invoices.init();
	ready = true;
	for (let listener of listeners) listener(DB);
});
