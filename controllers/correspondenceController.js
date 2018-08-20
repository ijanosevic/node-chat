RoomCorrespondence = require('../classes/roomCorrespondence');
Message = require('../classes/message');

class CorrespondenceController {

    constructor(){}
    static sendCorrespondence(socket, payload){
    	// console.log('client requesting room correspondence');

    	let notification = new NotificationFactory('Correspondence');

    	RoomCorrespondence.fetch(payload.id, 1, 20)
			.then(correspondence => {
				notification.addData('correspondence', correspondence);
				notification.addData('roomId', payload.id);
				
				// setuje se da bi klijent znao da li da apdejtuje ili kreira novu listu
				notification.addData('initial', true);
				socket.emit('correspondence', notification);
			})
			.catch(err_3 => {
				throw(err_3);
				console.log(err_3);
			});
    }

    static passMessage(socket, payload){
    	return new Promise((resolve, reject) => {
	    	// console.log('client emited a message');    	
	    	const roomId = payload.roomId;
	    	const content = payload.content;
	    	const senderId = payload.sender;

			new Message(content, senderId)
	    		.then(message => {

	    			RoomCorrespondence.addMessage(roomId, message)
	    				.then(msg => {
							resolve({roomId, msg});	    					
	    				})
	    				.catch(err => {});
	    		})
	    		.catch(err => {
					console.log(err);
					throw err;
				});
		});
    }


}

module.exports = CorrespondenceController;