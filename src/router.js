module.exports = {
    routes: [
		{ path: '/home', name: 'dashboard', component: require('./pages/Dashboard.vue'), alias:'/' },
        { path: '/test', component: require('./pages/Test.vue') },
		{ path: '/companies', name:'companies', component: require('./pages/Companies.vue') },
		{ path: '/company/:company_id', name:'company', component: require('./pages/Company.vue') }
    ]
};
