'use strict';

const {Controller} = require('easyone-electron');

class DashHome extends Controller{

	get view(){ return ' '; }
	get stylePath(){ return __dirname+'\\style.less'; }
	get componentsPath(){ return __dirname+'\\components'; }

	init(){
		this.addChild('companies-list', '_parent', 'companiesList');
		this.addChild('invoices-list', '_parent', 'invoicesList');
	}
}

module.exports = DashHome;
