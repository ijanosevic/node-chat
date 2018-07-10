const database = require('./database');

class RoomCorrespondence {
	static fetch(room_id, offset = 1, count = 1){
		
		let start = offset - 1;
		let stop = start + count - 1;
		
		return new Promise((resolve, reject) => {

			let messages = [];
			database.db.hget('r:'+room_id, 'correspondence', (err, correspondence_key) => {
				
				if (err) {
					reject(err);
				}

				if (correspondence_key === null) {
					resolve(messages);
				} else {
					
					database.db.lrange(correspondence_key, start, stop, (err_2, message_keys) => {

						if (err_2) {
							reject(err_2);
						}


						for (let i = 0; i < message_keys.length; i++) {
							database.db.hgetall(message_keys[i], (err_2, message) => {

								if (err_2) {
									reject(err_2);
								}


								console.log(message);
								messages.push(message);
								if (i === message_keys.length - 1){
									resolve(messages);
								}
							});
						}
					});
				}

			});
		});
	}
}

module.exports = RoomCorrespondence;