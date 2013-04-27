/*
* MESSAGES ROUTE.
* It retrievs user message's along user informations (nickname and avatar)
* Return JSON object ready to be paginated.
*/
module.exports = function (model) {
	return function(req, res) {
	    var page = req.param('page') > 0 ? req.param('page') : 0; 
	    var itemPerPage = 10;

	    var total = 0;

	    var queryCount = model.message.find().count();
	    var queryMessages = model.message.find()
	                            .populate('_user', 'nickname avatar')
	                            .sort({timestamp: -1})
	                            .skip(page * itemPerPage)
	                            .limit(itemPerPage);

	    queryCount.exec(function (error, count) {
	        if (error) throw error;
	        total = count;
	    });
	    
	    queryMessages.exec(function(error, messages) {
	        if (error) throw error;

	        messages.total = total;

	        res.send({
	            total: total, 
	            messages: messages
	        });
	    });
	};
};