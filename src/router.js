module.exports = {
    routes: [
		{ path: '/home', name: 'dashboard', component: require('./pages/Dashboard.vue'), alias:'/' },
        { path: '/test', component: require('./pages/Test.vue') },
		{ path: '/companies', component: require('./pages/Companies.vue') }
    ]
};
