'use strict';

function _normalize_field_schema(fieldSchema){
	if(typeof(fieldSchema) == 'object'){
		if(fieldSchema instanceof Array){
			fieldSchema = {
				schema: _normalize_field_schema(fieldSchema[0]),
				type: Array
			};
		}
	}else if(typeof(fieldSchema) == 'function'){
		if(fieldSchema == String){
			fieldSchema = { type: String };
		}else if(fieldSchema == Number){
			fieldSchema = { type: Number };
		}
	}
	return fieldSchema;
}

function _new_value(value, fieldSchema, key){
	if(fieldSchema.type == String && value){
		value = value.toString();
		if(fieldSchema.trim == true){
			value = value.trim();
		}
		if(fieldSchema.lowercase == true){
			value = value.toLowerCase();
		}
	}else if(fieldSchema.type == Number){
		value = parseInt(value);
		if(value == NaN) throw new Error('Field '+key+' invalid cast to Number!');
	}
	if(!value){
		if(fieldSchema.require == true) throw new Error('Field '+key+' is required!');
		if(fieldSchema.default) {
			if(fieldSchema.default == 'now') return new Date();
			return fieldSchema.default;
		}
		if(value === null) return null;
		return undefined;
	}
	if(fieldSchema.allowEmpty == false && value.length == 0) throw new Error('Field '+key+' is empty!');
	return value;
}

function _new_array(value, fieldSchema, key){
	if(!value){
		if(fieldSchema.require == true || fieldSchema.allowEmpty == false) throw new Error('Field '+key+' is empty!');
		return [];
	}
	if(!value instanceof Array) throw new Error('Field '+key+' must be an Array!');
	let newVal = [];
	for(let j=0;j<value.length;j++){
		newVal.push(_new_document(value[j], fieldSchema, {}));
	}
	return newVal;
}

function _new_document(params, schema, newDoc){
	let keys = Object.keys(schema);
	for(let i=0;i<keys.length;i++){
		let key = keys[i];
		let fieldSchema = _normalize_field_schema(schema[key]);
		let value = params[key];
		if(!fieldSchema) continue;
		if(!fieldSchema.type){
			newDoc[key] = _new_document(value, fieldSchema, {});
		}else if(fieldSchema.type == Array){
			newDoc[key] = _new_array(value, fieldSchema.schema, key);
		}else{
			newDoc[key] = _new_value(value, fieldSchema, key);
		}
		if(newDoc[key] === undefined) delete newDoc[key];
	}
	return newDoc;
}

module.exports = class LokiModel{

	constructor(schema){
		this._schema = schema;
	}

	get schema(){ return this._schema; }

	newDocument(params){
		return _new_document(params, this._schema, {});
	}

	// Return if the params is a valid document for this model
	valid(params){
		try{
			_new_document(params, this._schema, {});
		}catch(e){
			return false;
		}
		return true;
	}
}
