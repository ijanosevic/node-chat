const database = require('./database');

class User {
	static fetch(id){
		return new Promise((resolve, reject) => {
			
			database.db.hgetall('u:'+id, (err, data) => {
				if (err) {
					reject(err);
				}
				delete data.password;
				delete data.friend_list;
				delete data.room_list;
				delete data.member_keys;
				resolve(data);
			});
		});
	}
}

module.exports = User;