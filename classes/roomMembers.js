const database = require('./database');

class RoomMembers {
	static fetch(room){
		return new Promise((resolve, reject) => {

			database.db.smembers(room.member_list, (err, member_keys) => {
				if (err) {
					reject(err);
				}
					
				let members = [];
				for (let i = 0; i < member_keys.length; i++) {
					database.db.hgetall(member_keys[i], (err_2, friend) => {

						if (err_2) {
							reject(err_2);
						}
						
						delete friend.password;
						delete friend.room_list;
						delete friend.member_keys;

						members.push(friend);
						if (i === member_keys.length - 1){
							resolve(members);
						}
					});
				}
			});
		});
	}
}

module.exports = RoomMembers;