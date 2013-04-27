/*
* AVATAR ROUTES
* Return a new user's avatar in form of binary stream.
*/
module.exports = function (model) {
	return function(req, res) {
	    if (req.param('name')) {
	        var avatar = new model.avatar(req.param('name'));

	        res.set('Content-type','image/png');
	        res.end(avatar.getAvatar(), 'binary');
	    }
	};
};