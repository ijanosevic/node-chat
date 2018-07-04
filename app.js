var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var rdb = require('./db');
var r_keys = require('./redis_lookup');
var node_channels = require('./nd_ch_lookup');
// console.log(node_channels);


// models
UserModel = require('./models/userModel');

app.use('/static', express.static(__dirname+ '/resources'));

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/chat.html');
});

authRoutes = require('./routes/authRoutes')();
app.use('/auth', authRoutes);

contactRoutes = require('./routes/contactRoutes')();
app.use('/contact', contactRoutes);


http.listen(port, function(){
    console.log('Handshake dev running on port: ' + port);
});


var clients = {};
rdb.keys('c:*', (err, client_keys) => {
	for (let i = 0; i < client_keys.length; i++) {
		let client_id = client_keys[i].split(':')[1];
		clients[client_id] = false;
	}
});

io.sockets.on('connection', (socket) => {
	// console.log(socket.id);

	socket.on(node_channels.online, function(msg){

		let client_id = msg.uid;
		socket.client_id = client_id;
		clients[client_id] = socket.id;
		// console.log(`${client_id} CONNECTED...`);
		// console.log(clients);		

		UserModel.setStatus(client_id, 1);

		UserModel.get(client_id)
			.then(user_data => {
				const friend_ids = user_data.fr_ids.split('.');
				delete user_data.password;
				delete user_data.fr_ids;
				delete user_data.status;
				
				// posalji klijentu osnovne informacije o njegovom nalogu
				socket.emit(node_channels.online, user_data);

				UserModel.getFriends(client_id, friend_ids)
					.then(friends => {
						// posalji klijentu spisak njegovih prijatelja i njihove statuse
						socket.emit(node_channels.f_list, friends);
					})
					.catch(err => {
						console.log(err);
					});
			})
			.catch(err => {
				console.error(err)
			});

		// todo: obavesti prijatelje da je klijent online
		// todo: prosledi sve poruke koje su u queue-u

	});

	socket.on('disconnect', function(){

		clients[socket.client_id] = false;
		UserModel.setStatus(socket.client_id, 0);
		// console.log(`${socket.client_id} DISCONNECTED...`);
	});
});