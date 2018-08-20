const database = require('./database');
RoomMembers = require('./roomMembers');

class UserRooms {
	
	static fetch(user_id){
		return new Promise((resolve, reject) => {
			
			database.db.hget('u:'+user_id, 'room_list', (err, key) => {
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

							UserRooms.getTitle(room, user_id)
								.then(title => {

									room.title = title;
									rooms.push(room);

									if (i === room_keys_list.length - 1){
										resolve(rooms);
									}
								})

						});
					}
				});
				
			});
		});
	}

	static getTitle(room, user_id){
		return new Promise((resolve, reject) => {

			if (room.type === 'private') {
				RoomMembers.fetch(room)
					.then(members => {
						(members).forEach(member => {
							if (member.id !== user_id) {
								resolve(member.first_name + ' ' + member.last_name);
							}
						});
					})
					.catch(err => {
						throw err;
					});
			} else {
				resolve('nije privatna soba, ima svoj naziv');
			}

		});
	}
}

module.exports = UserRooms;