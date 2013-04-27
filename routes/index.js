/*
* Export all app's routes.
*/
module.exports = function (model) {
	return routes = {
		date     : require('./date.js')(model),
		avatar   : require('./avatar.js')(model),
		messages : require('./messages.js')(model),
		login    : require('./login.js')(model),
		logout   : require('./logout.js')(model)
	};
};