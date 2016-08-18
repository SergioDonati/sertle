'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class NewInvoice extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }

	get componentsPath(){ return __dirname+'\\components'; }

	init(){
		//this.addChild();
	}

};
