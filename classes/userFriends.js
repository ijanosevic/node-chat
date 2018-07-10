const database = require('./database');

class UserFriends {
	static fetch(id){
		return new Promise((resolve, reject) => {
			
			database.db.hget('u:'+id, 'friend_list', (err, key) => {
				if (err) {
					reject(err);
				}

				database.db.smembers(key, (err_2, friend_list) => {
					
					if (err_2) {
						reject(err_2);
					}
					
					let friends = [];
					for (let i = 0; i < friend_list.length; i++) {
						database.db.hgetall(friend_list[i], (err_3, friend) => {

							if (err_3) {
								reject(err_3);
							}
							
							delete friend.password;
							delete friend.room_list;
							delete friend.friend_list;

							friends.push(friend);
							if (i === friend_list.length - 1){
								resolve(friends);
							}
						});
					}
				});
			});
		});
	}
}

module.exports = UserFriends;