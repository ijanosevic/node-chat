class Client {
	
	constructor(){
		this.socketId = undefined;
		this.user = undefined;
	}

	assign(socket_id, user){
		// console.log('dodaljujem socket klijentu');
		this.socketId = socket_id;
		this.user = user;
	}

	retract(){
		// console.log('povlacim');
		this.socketId = false;
	}
}

module.exports = Client;