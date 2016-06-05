var express = require('express');
var socketio = require('socket.io');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/environment');

var models = require('require-all')({
    dirname : __dirname + '/models',
    filter: /(.+)\.js$/,
    recursive: true
});

require('./config/passport');
mongoose.connect('mongodb://localhost/cleannote');

var routes = require('./routes/index');
var users = require('./routes/users');
var sections = require('./routes/sections');
var cards = require('./routes/cards');
var todos = require('./routes/todos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);
app.use('/sections', sections);
app.use('/cards', cards);
app.use('/todos', todos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);
function startServer() {
    server.listen(config.port, config.ip, function() {
	console.log('Express server listening on %d', config.port);
    });
    var io = socketio.listen(server);
    io.sockets.on('connection', function(socket) {
	socket.on('join', function(data) {
	    socket.join(data.roomname);
	    socket.room = data.roomname;
	    // socket.room function(err, room) {
	    io.sockets.in(socket.room).emit('join', data.userid);
	    // });
	});
	socket.on('message', function(message) {
	    // socket.get('room', function(err, room) {
	    // 	io.sockets.in(room).emit('message', message);
	    // });
	    io.sockets.in(socket.room).emit('message', message);
	});
	socket.on('disconnect', function() {});
    });
}

setImmediate(startServer);

module.exports = app;
