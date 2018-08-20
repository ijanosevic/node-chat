User = require('../classes/user');
UserFriends = require('../classes/userFriends');
UserRooms = require('../classes/userRooms');
RoomCorrespondence = require('../classes/roomCorrespondence');
RoomMembers = require('../classes/roomMembers');
NotificationFactory = require('../classes/notificationFactory');


class UserOnlineController {

    constructor(){}
    
    static clientOnline(socket) {


		User.fetch(socket.user_id)
			.then(res => {
				let data = {
					profile: res
				}
				socket.emit('client_online_response', data);
			})
			.catch(err => {
				throw(err);
				console.log(err);
			});

		UserFriends.fetch(socket.user_id)
			.then(res => {
				let data = {
					friends: res
				}
				socket.emit('client_online_response', data);
			})
			.catch(err => {
				throw(err);
				console.log(err);
			});

		UserRooms.fetch(socket.user_id)
			.then(rooms => {
				for (let i = 0; i < rooms.length; i++) {
					socket.join(rooms[i].id);
					
					RoomMembers.fetch(rooms[i], true)
						.then(members => {

							rooms[i].member_list = members;

							RoomCorrespondence.fetch(rooms[i].id)
								.then(correspondence => {
									rooms[i].correspondence = correspondence;
									if (i === rooms.length - 1){

										let data = {
											rooms: rooms
										}
										setTimeout(() => {
											socket.emit('client_online_response', data);
										}, 100);
									}
								})
								.catch(err_3 => {
									throw(err_3);
									console.log(err_3);
								});
						})
						.catch(err_2 => {
							throw(err_2);
							console.log(err_2);
						});
				}
			})
			.catch(err => {
				throw(err);
				console.log(err);
			});
    }

    static attachPartnerId(user_id, member_list){
    	return new Promise((resolve, reject) => {
	    	member_list.forEach(member => {
	    		if (member.id !== user_id){
	    			resolve(member.id);
	    		}
	    	});
    	});
    }
}

module.exports = UserOnlineController;