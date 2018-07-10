class SocketServer {
	
	constructor(http){
		this.io = require('socket.io')(http);
	}

	listen(){

		console.log('Socket server is running');

		this.io.sockets.on('connection', (socket) => {
			console.log('client connected');

			socket.on('disconnect', function(){
				console.log('client disconnected');				
			});
		});
	}
}

module.exports = SocketServer;