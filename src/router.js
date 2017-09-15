import Dashboard from './pages/Dashboard.vue'
import Companies from './pages/Companies.vue'
import Test from './pages/Test.vue'
import Company from './pages/Company.vue'
import Invoices from './pages/Invoices.vue'
import Invoice from './pages/Invoice.vue'
import NewInvoice from './pages/NewInvoice.vue'

module.exports = {
    routes: [
		{ path: '/home', name: 'dashboard', component: Dashboard, alias:'/' },
        { path: '/test', component: Test },
		{ path: '/companies', name:'companies', component: Companies },
		{ path: '/company/:company_id', name:'company', component: Company },
		{ path: '/invoices', name:'invoices', component: Invoices },
		{ path: '/invoice/:invoice_id', name:'invoice', component: Invoice },
		{ path: '/new/invoice', name:'newInvoice', component: NewInvoice },
    ]
};
