const database = require('./database');

class RoomCorrespondence {
	
	static fetch(room_id, offset = 1, count = 1){
		
		let start = offset - 1;
		let stop = start + count - 1;
		
		return new Promise((resolve, reject) => {

			let messages = [];
			database.db.hget('r:'+room_id, 'correspondence', (err, correspondence_key) => {
				
				// console.log('room_id:' + room_id);
				// console.log('correspondence_key:' + correspondence_key);

				if (err) {
					reject(err);
				}

				if (correspondence_key === null) {
					messages[0] = {
						last_message: ''
					}
					console.log('vracam samo praznu poruku');
					resolve(messages);
				} else {
					
					// console.log('start: ' + start);
					// console.log('stop: ' + stop);

					database.db.lrange(correspondence_key, start, stop, (err_2, message_keys) => {

						if (err_2) {
							reject(err_2);
						}

						// console.log('correspondence_key:' + correspondence_key);
						// console.log(`message_keys: ${message_keys}`);

						for (let i = 0; i < message_keys.length; i++) {
							database.db.hgetall(message_keys[i], (err_2, message) => {

								if (err_2) {
									reject(err_2);
								}

								message = RoomCorrespondence.prepareMessage(message);
								
								// console.log(message);
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

	static getCorrespondenceKey(roomId){
		return new Promise((resolve, reject) => {

			let messages = [];
			database.db.hget('r:'+roomId, 'correspondence', (err, correspondenceKey) => {
				if (correspondenceKey === null) {
					RoomCorrespondence.generateKey(roomId)
						.then(correspondenceKey => {
			    			resolve(correspondenceKey);
			    		})
			    		.catch(err => {
							console.log(err);
							throw err;
						});
				} else {
					resolve(correspondenceKey);
				}
			});
		});
	}

	static generateKey(roomId){
		return new Promise((resolve, reject) => {
			database.db.incr('corespondence_count', (err, corespondence_count) => {
				const correspondenceKey = `c:${corespondence_count}`;
				RoomCorrespondence.attachCorrespondence(roomId, correspondenceKey)
					.then(() => {
						resolve(correspondenceKey);
					})
			});
		});
	}

	static addMessage(roomId, msg){
		return new Promise((resolve, reject) => {
			RoomCorrespondence.getCorrespondenceKey(roomId)
	    		.then(correspondenceKey => {
	    			// console.log(correspondenceKey); // AKO JE NULL KREIRAJ c:ID i atacuj ga za sobu pa tek nakon toga dodaj poruku u korespondenciju
	    			const messageKey = 'msg:'+msg.id;
	    			database.db.lpush(correspondenceKey, messageKey);
	    			resolve(RoomCorrespondence.prepareMessage(msg));
	    		})
	    		.catch(err => {
					console.log(err);
					throw err;
				});
		});
	}

	static attachCorrespondence(roomId, correspondenceKey){
		return new Promise((resolve, reject) => {
			database.db.hset('r:'+roomId, 'correspondence', correspondenceKey, () => {
				resolve(true);
			});
		});
	}

	static prepareMessage(message){
		// console.log('pripremam');
		// console.log(message);
		message.last_message = message.content.substr(0, 45) + '...';
		return message;
	}
}

module.exports = RoomCorrespondence;