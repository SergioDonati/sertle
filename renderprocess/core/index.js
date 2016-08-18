'use strict';

const App = require('./App');

module.exports = {
	Component: require('./Component/index'),
	getCurrentApp: App.getCurrentApp,
	StartApp: App.start,
	Controller: require('./Controller'),
	Modal: require('./Modal')
};
