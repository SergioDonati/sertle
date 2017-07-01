'use strict';

module.exports.state = {
	dbDriver: require('../DBDriver'),
	user: null
};

module.exports.mutations = {
	setUser: (state, user) => {
		state.user = user;
	}
}

module.exports.getters = {
	user: state => {
		return state.user;
	},
	defaultIVA: (state, getters) => {
		if(!getters.user) return 22;
		return getters.user.invoiceSetting.defaultIVA;
	}
}
