var express   = require('express')
   ,app       = express()
   ,server    = app.listen(8080)
   ,io		  = require('socket.io').listen(server)
   ,nicknames = [];

app.configure(function() {
	app.use(express.static(__dirname + '/public/'));
});

var count = 0;

io.sockets.on('connection', function(socket) {
	//socket.emit('counter', {number: count});
	//socket.broadcast.emit('counter', {number: count});

	//socket.emit('connect', {user: {name: 'usuario_' + new Date().getTime()}});

	socket.on('sendyou', function(data) {
		socket.emit('sendyou', {nick: socket.nickname, message: data});
		socket.broadcast.emit('sendyou', {nick: socket.nickname, message:data});
	});


	socket.on('nickname', function(data, fn) {
		count++;
		console.log("Total usuarios: " + count);
		nicknames.push(data);
		socket.nickname = data;
		socket.emit('nicknames', nicknames);
		socket.broadcast.emit('nicknames', nicknames);
	});

	socket.on('disconnect', function() {
		if(!socket.nickname) return;

		if(nicknames.indexOf(socket.nickname) > -1) {
			nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		}
		console.log(nicknames);
		count--;
		console.log("Total usuarios: " + count);
		//socket.emit('counter', {number: count});
		//socket.broadcast.emit('counter', {number: count});
	});
});