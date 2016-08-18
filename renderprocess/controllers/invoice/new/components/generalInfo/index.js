'use strict';

const {Controller, app} = require('easyone-electron');

module.exports = class GeneralInfo extends Controller {

	get viewPath(){ return __dirname+'\\view.pug'; }
	//get stylePath(){ return __dirname+'\\style.less'; }

};
