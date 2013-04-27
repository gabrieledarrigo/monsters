/*
* USER MODEL
* Define a user schema and expose the model to the app.
*/
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	nickname : String,
	avatar 	 : String,
	active   : Number,
	messages : [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
});

var User = mongoose.model('User', userSchema);

module.exports = User;