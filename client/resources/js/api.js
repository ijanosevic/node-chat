function setLocalStorageItem(key, data){
	localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorageItem(key){
	var retrievedObject = JSON.parse(localStorage.getItem(key));
	return retrievedObject;
}

function getContacts(){
	return getLocalStorageItem('friends');
}

function getRooms(){


	return getLocalStorageItem('rooms')
		.map(room => {
			room['picture_url'] = getRoomPictureUrl(room);
			return room;
		});
}

function getContact(id){
	let contacts = getContacts();
	return contacts
		.filter(contact => contact.id == id)
		.pop();
}

function getRoom(id){
	let rooms = getRooms();
	return rooms
		.filter(room => room.id == id)
		.pop();
}

function getRoomPictureUrl(room){

	/*
	todo: handle different room pictures 
		1. single member profile picture if private room
		2. group room picture
		3. composit of profile pictures if group room picture is not set
	*/

	for (var i = 0; i < room.member_list.length; i++) {
		let member_id = room.member_list[i];
		if(member_id !== user_id) {
			let contact = getContact(member_id);
			room_picture_url = contact.profile_picture_url;
			return room_picture_url;
		}
	}
}