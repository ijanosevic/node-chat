const r_keys = require('../redis_lookup');
const db = require('../db');

class User {
	
	constructor(user_id){

		this.client_db_key = r_keys.client+user_id;
		var self = this;

		return new Promise((resolve, reject) => {
	    	db.hgetall(this.client_db_key, function(err, user_data){
	    		self.data = user_data;
				resolve(self);
			});
		});
	}

	updateStatus(status){
		this.data.status = status;
		db.hset(this.client_db_key, 'status', status);
	}
}

module.exports = User;