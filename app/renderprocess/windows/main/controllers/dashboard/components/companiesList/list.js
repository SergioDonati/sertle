'use script';

module.exports = function CompaniesItemList(app, component) {
	component.setRelativeViewPath('../list.pug');

	component.setCompanies = (companies) => {
		component.addRenderLocals('companies', companies)
		if(component.rendered) component.refresh(null, true);
	}

	component.addDOMListener('openCompany', (event, element) => {
		let companyID = element.getAttribute('data-company-id');
		app.controllerManager.startNew('company/detail', companyID);
	});
};
