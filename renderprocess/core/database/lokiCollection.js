'use strict';

module.exports = class LokiCollection{
	constructor(db, model){
		this._db = db;
		this._model = model;
	}

	initialize(){}

	init(){
		this._collection = this._db.getCollection(this.collectionName);
		if(this._collection) return;
		this._collection = this._db.addCollection(this.collectionName, this.collectionOptions);
		initialize();
	}

	get model(){ return this._model; }
	get collection(){ return this._collection; }

	get collectionName(){ return null; }
	get collectionOptions(){ return { }; }

	insert(doc){
		let newDoc = this._model.newDocument(doc);
		newDoc = this._companies.insert(newDoc);
		if(!newDoc) throw new Error('Error while inserting');
		return newDoc;
	}

	find(query){
		return this._collection.find(query);
	}
}
