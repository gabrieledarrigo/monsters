/*
* Database handler.
* Return database connection.
*/
var mongoose = require('mongoose');

var host = process.env.MONGO_URL || 'localhost';

var mongoHandler = function() {
    mongoose.connect(host, function(error) {
        if (error) {
            console.log('Database is down...');
            throw error;
        }
    });

    var db = mongoose.connection;

    db.on('error', function() {
        console.log('Error in connecting database');
    });

    db.once('open', function() {
        console.log('MongoDb is Up and Running Dude');
    });

    return db;
};

module.exports = mongoHandler;