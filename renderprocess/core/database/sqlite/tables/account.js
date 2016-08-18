'use strict';

let db = require("../db");

class AccountManager {
	constructor(db) {
		this._db = db;
	}

	createTable(){
		var self = this;
		self._db.serialize(function(){
			self._db.run('CREATE TABLE "Account"( \
				"ID" integer primary key autoincrement not null ,\
				"UserName" varchar(140) ,\
				"FirstName" varchar(140) ,\
				"LastName" varchar(140) ,\
				"Email" varchar(140) ,\
				"Password" varchar(140) ,\
				"Birthday" varchar(140) ,\
				"EntityID" integer ,\
				"CreationTime" varchar(140),\
				"InvoiceHeaderText" varchar(140),\
				"InvoiceFooterText" varchar(140)\
			)');
		});
	}

	createUser(user){
		/*let stmt = self.db.prepare("INSERT INTO users(name, email) VALUES ('"+user.name+"','"+user.email+"')");
		stmt.run();
		stmt.finalize();*/
	}

	login(username, password, callback){
		this._db.serialize(function(){
			self._db.all('SELECT * FROM Account WHERE Username = ? AND Password = ?', [ username, password ], function(err, row){
				callback(err, row);
			});
		});
	}
}

module.exports = new AccountManager(db);
