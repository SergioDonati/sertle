'use strict';

let usernameInput = null;
let passwordInput = null;

module.exports = function Login(app, controller) {
	controller.useDefaultPaths(__dirname);

	controller.on('rendered', parent => {
		usernameInput = parent.querySelector('#login-form [name="username"]');
		passwordInput = parent.querySelector('#login-form [name="password"]');
	});

	controller.addDOMListener('onSubmit', () => {
		const username = usernameInput.value.trim();
		const password = passwordInput.value;
		const user = app.getCollections('Users').login(username, password);
		if (!user){
			alert('Username o password sono sbagliate!');
		}else{
			app.setProperty('user', user);
			app.login(user);
		}
	});

};
