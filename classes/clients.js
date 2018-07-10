var r_keys = require('../redis_lookup');
const db = require('../db');
Client = require('./client');

class Clients {
	
	constructor() {
		
		this.list = {};

		db.keys('c:*', (err, client_keys) => {
			for (let i = 0; i < client_keys.length; i++) {
				const client_id = client_keys[i].split(':')[1];
				this.list[client_id] = new Client();
			}
		});
	}

	connect(user, socket_id){
		
		this.list[user.data.id].assign(socket_id, user);
		user.updateStatus(1);
	}

	disconnect(user_id){
		this.list[user_id].retract();
		this.list[user_id].user.updateStatus(0);
	}
}

module.exports = Clients;