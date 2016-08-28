'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class InvoiceTemplate extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }

	init(){
        let invoice = JSON.parse(JSON.stringify(app.getProperty('invoice')));
        this.renderArgs.locals.invoice = invoice;
	}
};
