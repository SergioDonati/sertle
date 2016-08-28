'use script';

const {Component} = require('../../core');

module.exports = class Info extends Component {

	constructor(){
		super(__dirname+'\\view.pug');
	}

	render(args, callback){
		var locals = {
			node_version: window.process.versions.node,
			chrome_version: window.process.versions.chrome,
			electron_version: window.process.versions.electron
		};
		super.render({ locals:locals }, callback);
	}
};
