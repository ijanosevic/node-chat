const redis = require("redis");

class Database {
	
	constructor() {
		this.db = redis.createClient(6379, '127.0.0.1');
		this.keys = {};
	}
}

module.exports = new Database();