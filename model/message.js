/*
* MESSAGE MODEL
* Define a message schema and expose the model to the app.
*/
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	_user  : {type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    message   : String,
    date      : String,
    timestamp : Number
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;