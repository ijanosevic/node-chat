var rdb = require('../db');
var r_keys = require('../redis_lookup');

class Database {
	
	constructor() {
		this.db = rdb;
		this.r_keys = r_keys;
	}
}

module.exports = Database;