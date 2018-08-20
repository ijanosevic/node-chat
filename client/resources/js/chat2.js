
const user_id = docCookies.getItem('user_id');
if (!user_id){
	window.location = host_url;
}

const myData = getLocalStorageItem('profile');

// event listeners
// chat sidebar show/hide
chatInfoBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if (chatBoxInfoWrapper.classList.contains('hidden')){
		chatBoxWrapper.classList.remove('m9');
		chatBoxWrapper.classList.add('m7');
		chatBoxInfoWrapper.classList.remove('hidden');
		chatContent.className = 'col s10 offset-s1 m8 offset-m2 chat-content';
	} else {
		chatBoxWrapper.classList.remove('m7');
		chatBoxWrapper.classList.add('m9');
		chatBoxInfoWrapper.classList.add('hidden');
		chatContent.className = 'col s10 offset-s1 m6 offset-m3 chat-content';
	}
});

// create new chat room
createChatRoomBtn.addEventListener('click', (e) => {
	e.preventDefault();
	
	// fetch svih kontakata
	const contacts = getContacts();

	// kreiranje html liste
	createSelectableContactListHtml(contacts);

	// prikazivanje overlay-a
	showNewRoomOverlay();
});

// send api request for creating a new room
startRoomBtn.addEventListener('click', (e) => {
	e.preventDefault();
	console.log(e);
});

// show layout for adding new friend
addNewContactBtn.addEventListener('click', showNewContactFormOverlay);

// filter chatrooms on input 
filterChatRoomsInput.addEventListener('keyup', (e) => {
	console.log('filtriraj chat sobe');
});

// filter contacts on creating a room menu
filterSelectableContactsInput.addEventListener('keyup', (e) => {
	console.log('filtriraj selektabilne kontakte');
});

// filter basic contacts list
filterContactsInput.addEventListener('keyup', (e) => {
	console.log('filtriraj kontakte');
});



function displayChatRoom(el){
	
	chatRoomList.querySelectorAll('li').forEach(li => {
		li.classList.remove('selected');
	})
	el.classList.add('selected');

	const room_id = el.dataset.id;
	chatBoxWrapper.dataset.id = room_id;
	chatBoxWrapper.dataset.pristine = true;
	
	const room = getRoom(room_id);
	let room_picture_url = getRoomPictureUrl(room);

	chatBoxHeader.querySelector('.chat-picture-wrapper img').setAttribute('src', room_picture_url);
	chatBoxHeader.querySelector('.chat-info .name').innerText = room.title;
	fetch(channels.fetch_correspondence, room_id);
}

// socket communication
var socket = io('http://localhost:3000/');
updateClientSocket(socket, user_id);

// channels
const channels = {
	online: 'client_online',
	online_response: 'client_online_response',
	fetch_friends: 'f_friends',
	friends: 'friends',
	fetch_rooms: 'f_rooms',
	rooms: 'rooms',
	fetch_correspondence: 'f_correspondence',
	correspondence: 'correspondence',
	send_message: 's_message',
	message: 'message',
	send_typing: 's_typing',
	typing: 'typing',
	create_room: 'c_room',
	room: 'room'
}

function getNewSocketId(socket){
	
	return new Promise((resolve, reject) => {
		var interval = setInterval(() => {
			if (socket.id !== undefined) {
				resolve(socket.id);
				clearInterval(interval);
			} 
		}, 50);
	});
}

function updateClientSocket(socket, user_id){
	getNewSocketId(socket)
		.then(socket_id => {
			var creds = {
				sid: socket_id,
				uid: user_id
			}
			socket.emit(channels.online, creds);
		})
		.catch(err => {
			console.log('NEuspesno');
			console.error(err);
		});
}

socket.on(channels.online_response, (data) => {

	// console.log('data on channel "client_online_response"');

	Object.keys(data).forEach(key => {

		setLocalStorageItem(key, data[key]);

		if (key === 'friends') {

			const contacts = getContacts();
			createContactListHtml(contacts);
		} else if (key === 'rooms') {

			const chatRooms = getRooms();
			createChatRoomListHtml(chatRooms);
		}
	});
});

socket.on(channels.correspondence, (data) => {

	console.log('data on channel "correspondence"');
	let room_members = data.results.correspondence
		.map(message => message.sender)
		.unique()
		.map(member_id => {
			let contact = getContact(member_id);
			if (!contact) {
				contact = myData;
			}
			return contact;
		});
	updateChatRoomHtml(data, room_members);
});

