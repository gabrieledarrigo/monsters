var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , handler = require('./handler')()
    , model = require('./model')
    , routes = require('./routes')(model);

app.configure(function() {
    app.set('view', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

io.sockets.on('connection', function(socket) {
    socket.on('message', function(data) {

        var message = new model.message({
            _user     : data._user._id,
            message   : data.message,
            date      : data.date,
            timestamp : data.timestamp
        });

        message.save(function(error) {
            if (error) throw error;

            model.user.findById(data._user._id, function(error, user) {
                if (error) throw error;
                user.messages.push(message);

                user.save(function (error) {
                    if (error) throw error;
                });
            });
        });

        socket.broadcast.emit('message', data);
    });
});

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

app.get('/get-date/:date', routes.date);

app.get('/get-messages/:page?', routes.messages);

app.get('/get-avatar/:name', routes.avatar);

app.get('/login', routes.login);

app.get('/logout', routes.logout);

server.listen(8080, function() {
    setInterval(function () {
        model.user.update({active : 1}, {active : 0}, {multi : true}, function (error, document) {
            console.log(document + ' number of documets was updated');
        });
    }, (1000 * 60 * 60 * 24));
    console.log('Http Server Up and Running Dude');
});
