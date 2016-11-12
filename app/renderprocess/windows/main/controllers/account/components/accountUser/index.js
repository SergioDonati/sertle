'use script';

module.exports = function AccountUser(app, component) {

	const user = app.getProperty('user');
	if(!user) return;
	component.addRenderLocals('user', user);

};
