'use strict';

module.exports = function Account(app, controller){

	controller.addDOMListener('navClick', (event, element) => {

		event.preventDefault();
		if(element.classList.contains('active')) return; // just active

		const links = controller.querySelectorAll('#sidebar-menu nav a');
		const tabs = controller.querySelectorAll('.tab');

		for (let l of links) {
			l.classList.remove('active');
		}
		for (let t of tabs) {
			if(element.dataset.tab == t.id) t.classList.add('active');
			else t.classList.remove('active');
		}

		element.classList.add('active');
	});
};
