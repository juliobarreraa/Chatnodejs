var express = require('express')
   ,app     = express()
   ,server  = app.listen(8080)
   ,io		= require('socket.io').listen(server);

app.configure(function() {
	app.use(express.static(__dirname + '/public/'));
});

var count = 0;

io.sockets.on('connection', function(socket) {
	count++;
	socket.emit('counter', {number: count});
	socket.broadcast.emit('counter', {number: count});

	socket.emit('connect', {user: {name: 'usuario_' + new Date().getTime()}});

	socket.on('sendyou', function(data) {
		socket.emit('sendyou', data);
		socket.broadcast.emit('sendyou', data);
	});

	socket.on('disconnect', function() {
		count--;
		socket.emit('counter', {number: count});
		socket.broadcast.emit('counter', {number: count});
	});
});