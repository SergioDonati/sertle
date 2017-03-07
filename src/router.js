module.exports = {
    routes: [
		{ path: '/home', name: 'dashboard', component: require('./pages/Dashboard.vue'), alias:'/' },
        { path: '/test', component: require('./pages/Test.vue') },
		{ path: '/companies', name:'companies', component: require('./pages/Companies.vue') },
		{ path: '/company/:company_id', name:'company', component: require('./pages/Company.vue') },
		{ path: '/invoices', name:'invoices', component: require('./pages/Invoices.vue') },
		//{ path: '/invoice/:invoice_id', name:'invoice', component: require('./pages/Invoice.vue') },
		//{ path: '/invoices/new', name:'new-invoice', component: require('./pages/NewInvoice.vue') },
    ]
};
