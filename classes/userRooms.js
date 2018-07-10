const database = require('./database');

class UserRooms {
	static fetch(id){
		return new Promise((resolve, reject) => {
			
			database.db.hget('u:'+id, 'room_list', (err, key) => {
				if (err) {
					reject(err);
				}

				database.db.smembers(key, (err_2, room_keys_list) => {
					
					if (err_2) {
						reject(err_2);
					}
					
					let rooms = [];
					for (let i = 0; i < room_keys_list.length; i++) {
						database.db.hgetall(room_keys_list[i], (err_3, room) => {

							if (err_3) {
								reject(err_3);
							}

							if (room.type === 'private') {
								room['title'] = 'Pull contacts name as title';
							}

							rooms.push(room);
							if (i === room_keys_list.length - 1){
								resolve(rooms);
							}
						});
					}
				});
				
			});
		});
	}
}

module.exports = UserRooms;