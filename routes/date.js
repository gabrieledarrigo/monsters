/*
* DATE ROUTES
* Return a date in dd/mm/yyyy format.
*
*/
module.exports = function (model) {
	return function(req, res) {
		if (req.param('date')) {
		    res.send({
		        date: model.date.convert(req.param('date'))
		    });
		} else {
		    res.send({
		        date: model.date.convert(new Date())
		    });
		}
	};
};