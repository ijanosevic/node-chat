const database = require('./database');

/*
lpush c:2 msg:4 msg:5
hset r:0003 correspondence c:2
hset msg:4 id 4 sender 3333 content 'Kako si, sa kim si, sta radis?' created_at 1531144140758 
hset msg:5 id 5 sender 0000 content 'Evo me doma, sa Lazarem, programiramo. U LAZARE, to si ti u stvari???' created_at 1531144163284
*/

class Message {
	constructor(content, senderId){
		return new Promise((resolve, reject) => {
			
			this.createMessageId()
	    		.then(new_message_id => {
	    			this.id = new_message_id;
	    			this.content = content;
	    			this.sender = senderId;
	    			this.created_at = Date.now();
	    			database.db.hmset('msg:'+this.id, this);	    			
	    			resolve(this);
	    		})
	    		.catch(err => {
	    			throw err;
	    		});
		});
	}

	createMessageId(){
		return new Promise((resolve, reject) => {
			database.db.incr('msg_count', (err, msg_count) => {
				resolve(msg_count);
			});
		});
	}
}

module.exports = Message;