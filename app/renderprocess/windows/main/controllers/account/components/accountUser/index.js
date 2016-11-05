'use script';

const {Component, app} = require('easyone-electron');

module.exports = class AccountUser extends Component {

	get viewPath(){ return __dirname+'\\view.pug'; }
	get componentsPath(){ return __dirname; }

	init(){
		let user = app.getProperty('user');
		if(!user) return;
		this.user = user;
		this.addRenderLocals('user', this.user);
	}

};
