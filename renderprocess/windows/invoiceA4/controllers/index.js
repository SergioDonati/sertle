'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class Login extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }

	init(){
        this.renderArgs.locals.invoice = app.getProperty('invoice');
	}
};
