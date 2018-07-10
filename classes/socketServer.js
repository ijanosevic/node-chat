UserFriends = require('./userFriends');
UserRooms = require('./userRooms');
RoomMembers = require('./roomMembers');
RoomCorrespondence = require('./roomCorrespondence');

class SocketServer {
	
	constructor(http){
		this.io = require('socket.io')(http);
		this.clients = {};
	}

	listen(){

		// console.log('Socket server is running');

		this.io.sockets.on('connection', (socket) => {
			
			// console.log('client connected');

			socket.on('client_online', (payload) => {
				this.clients[socket.user_id] = socket;
				socket.user_id = payload.uid;
				this.sendInitialResponse(socket);
			});

			socket.on('f_friends', (payload) => { this.sendFriends(socket, payload) });
			
			socket.on('f_rooms', (payload) => { this.sendRooms(socket, payload) });
			
			socket.on('f_correspondence', (payload) => { this.sendCorrespondence(socket, payload) });

			socket.on('s_message', (payload) => { this.passMessage(socket, payload) });
			
			socket.on('s_typing', () => { this.passTyping(socket) });

			socket.on('c_room', (payload) => { this.createRoom(socket, payload) });

			socket.on('disconnect', () => {
				delete this.clients[socket.user_id];
				this.clientDisconnected(socket);
			});
		});
	}

	sendInitialResponse(socket){
		
		socket.emit('client_online_response', 'Server response to "client_online" socket event');
	}

	sendFriends(socket, payload){
		console.log('client requesting friend list, payload: ');
		socket.emit('friends', 'Server response to "f_friends" socket event');
	}

	sendRooms(socket, payload){
		console.log('client requesting room list');
		socket.emit('rooms', 'Server response to "f_rooms" socket event');
	}

	sendCorrespondence(socket, payload){
		console.log('client requesting room correspondence');
		socket.emit('correspondence', 'Server response to "f_correspondence" socket event');
	}

	passMessage(socket, payload){
		console.log('client emited a message');
		socket.emit('message', 'Server response to "s_message" socket event');
	}

	createRoom(socket, payload){
		console.log('client creating a room/subject/group');
		socket.emit('room', 'Server response to "c_room" socket event');
	}

	passTyping(socket){
		console.log('client emited typingggg');
		socket.emit('typing', 'Server response to "s_typing" socket event');
	}

	clientDisconnected(socket){
		console.log('client disconnected');
		let user_id = socket.user_id;
		if (user_id !== undefined){
			socket.broadcast.emit('disconnected', `user ${user_id} disconnected`);
		}
	}	
			
}

module.exports = SocketServer;