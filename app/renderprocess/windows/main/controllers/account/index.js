'use strict';

const {Controller} = require('easyone-electron');

module.exports = class Account extends Controller{

	get viewPath(){ return __dirname+'\\view.pug'; }
	get stylePath(){ return __dirname+'\\style.less'; }
	get componentsPath(){ return __dirname+'\\components'; }

	init(){
		this.addDOMListener('navClick', this.navClick.bind(this));
	}

	navClick(event, element){

		event.preventDefault();
		if(element.classList.contains('active')) return; // just active

		const links = this.querySelectorAll('#sidebar-menu nav a');
		const tabs = this.querySelectorAll('.tab');

		for (let l of links) {
			l.classList.remove('active');
		}
		for (let t of tabs) {
			if(element.dataset.tab == t.id) t.classList.add('active');
			else t.classList.remove('active');
		}

		element.classList.add('active');
	}
}
