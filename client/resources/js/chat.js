var host_url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

var user_id = docCookies.getItem('user_id');
if (!user_id){
	window.location = host_url;
}

var add_contact_form = document.getElementById('add_contact_form');
add_contact_form.querySelector('a').addEventListener('click', (e) => {
	e.preventDefault();
	var friends_email = add_contact_form.querySelector('input');
	if (friends_email.value !== ''){
		var payload = {
			email: friends_email.value
		}
		postData('http://localhost:3000/contact/add', payload)
			.then(response => {
				alert(response);
				friends_email.value = '';
			})
			.catch(error => {
				console.error(error);
			});		
	}
});



// socket communication  ================================================================

var channels = {
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

var socket = io('http://localhost:3000/');
updateClientSocket(socket, user_id);

/*socket.on(channels.online, function(data){

	var account_details_ul = document.getElementById('account_details');
	for (let key in data){
		let node = document.createElement("li");
		let textnode = document.createTextNode(key + ': ' + data[key]);
		node.appendChild(textnode);
		account_details_ul.appendChild(node);
	}
});

socket.on(channels.friends, function(data){

	console.log(data);
	var friend_list_ul = document.getElementById('friendList');

	const friend_list = data.friend_list;
	console.log(friend_list);
	const update_type = data.update_type;

	if (update_type === 'init') {

		for (var i = 0; i < friend_list.length; i++) {
			const friend = friend_list[i];
			const friend_id = friend.id;
			let initials = friend.username.substr(0, 2).toUpperCase();
			let username = friend.username;
			let online_status = (friend.status === '0') ? '' : 'blur_on';
			let contact_html = `<li class="collection-item avatar" data-id="${friend_id}">
									<i class="material-icons circle blue">${initials}</i>
									<span class="title">${username}</span>
									<a href="#!" class="secondary-content"><i class="material-icons status">${online_status}</i></a>
								</li>`;
			friend_list_ul.insertAdjacentHTML('beforeend', contact_html);
		}
	} else {
		console.log('update samo jednog kontakta');
		console.log(data);
		friend_list_ul.querySelectorAll('li').forEach(li => {
			if (li.dataset.id === data.friend_id) {
				console.log('nasao');
				console.log(li);
				console.log(data.status);
				let online_status = (data.status === '0') ? '' : 'blur_on';
				li.querySelector('.status').innerText = online_status;
				// console.log(li.querySelector('.status').innerText);
			}
		});
	}
});*/

/*socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
	socket.emit('ferret', 'tobi', function (data) {
		console.log(data); // data will be 'woot'
	});
});*/

socket.on('friends', (data) => {
	// console.log('data on channel "friends"');
	console.log(data);
	// outputContacts(data.results.friends);
});

socket.on('rooms', (data) => {
	console.log('data on channel "rooms"');
	console.log(data);
});

socket.on('correspondence', (data) => {
	console.log('data on channel "correspondence"');
	console.log(data);
	outputCorrespondence(data.results);
});

socket.on('message', (data) => {
	console.log('data on channel "message"');
	console.log(data);
});

// TODO: napraviti isti event listener za sve sobe koji ce se atacovati onog momenta kada stigne inicijalni odgovor sa servera
/*socket.on('0001', (data) => {
	console.log('data on channel "message"');
	console.log(data);
});*/

socket.on('typing', (data) => {
	console.log('data on channel "typing"');
	console.log(data);
});

socket.on('room', (data) => {
	console.log('data on channel "room"');
	console.log(data);
});

socket.on('client_online_response', (data) => {
	console.log('data on channel "client_online_response"');
	console.log(data);

	Object.keys(data.results).forEach(key => {
		setLocalStorageItem(key, data.results[key]);
	});

	outputContacts(data.results.friends);
	outputRooms(data.results.rooms);
});

socket.on('disconnected', (data) => {
	console.log('changes on network, some of your friends just went offline');
	console.log(data);
});

function outputContacts(friend_list, update = false){

	let update_html = '';
	if (update === false) {
		friend_list.forEach(friend => {
			const initials = friend.first_name.substr(1, 1) + friend.last_name.substr(1, 1);
			update_html += `<li class="collection-item avatar">
								<a href="#" data-id="${friend.id}" onclick="switchToRoomWindow(this)"> 
									<i class="material-icons circle orange">${initials}</i>
									<span class="title">${friend.first_name} ${friend.last_name}</span>
									<p>First Line</p>
									<!-- <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a> -->
								</a>
							</li>`;
		});
		document.getElementById('friendList').innerHTML = update_html;
	} else {
		console.log('dopuniti listu kontakata, stigao arg[1] update != false');
	}
}

function outputRooms(room_list, update = false){

	let update_html = '';
	if (update === false) {
		room_list.forEach(room => {

			const initials = room.title.split(' ')[0].substr(0, 1) + room.title.split(' ')[1].substr(0, 1);

			/*
				TODO: obavezno refaktorisanje ovog li elementa tako da:
					- sadrzi u sebi A data-id="666" data-contact="0000"
			*/

			// const friendId = (room.type === 'private') ? room.partnerId : '';
			//  data-friend="${friendId}"


			update_html += `<li class="collection-item avatar" data-id="${room.id}" onclick="fetchCorrespondence(this)">
								<i class="material-icons circle orange">${initials}</i>
								<span class="title">${room.title}</span>
								<p>${room.correspondence[0].last_message}</p>
								<!-- <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a> -->
							</li>`;
		});
		document.getElementById('chatList').innerHTML = update_html;
	} else {
		console.log('dopuniti listu soba, stigao arg[1] update != false');
	}
}

function fetchCorrespondence(e){
	const roomId = e.dataset.id;
	var data = { roomId }
	socket.emit(channels.fetch_correspondence, data);
}

function outputCorrespondence(data){

	let my_profile_data = getLocalStorageItem('profile');
	let friend_list = getLocalStorageItem('friends');
	let repacked_friends = {};
	friend_list.forEach(friend => {
		repacked_friends[friend.id] = friend;
	});

	let correspondence_html = '';
	data.correspondence.forEach(msg => {
		if (Object.keys(msg).includes('content')) {
			
			let msg_sender_class = '';
			let initials = 'JA';

			if (msg.sender === user_id) {
				msg_sender_class = 'me';
				initials = my_profile_data.first_name.substr(0, 1) + my_profile_data.last_name.substr(0, 1);
			} else {
				initials = repacked_friends[msg.sender].first_name.substr(0, 1) + repacked_friends[msg.sender].last_name.substr(0, 1);
			}

			correspondence_html += `<li class="${msg_sender_class}">
								<i class="material-icons circle orange">${initials}</i>
								<p>${msg.content}<span class="time">${msg.created_at}</span></p>
							</li>`;
		}
	});
	document.getElementById('chat_content').querySelector('ul').innerHTML = correspondence_html;
	document.getElementById('chat_form').setAttribute('data-room-id', data.roomId);
}

function printFriends(){}

function setLocalStorageItem(key, data){

	localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorageItem(key){
	var retrievedObject = JSON.parse(localStorage.getItem(key));
	return retrievedObject;
}

function init_SPA_PageNavigation(){
	document.getElementById('nav').querySelectorAll('a').forEach(link => {
		const self = link;
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const page_id = self.dataset.page;
			document.querySelectorAll('.page').forEach(page => {
				if (page.id == page_id){
					page.style.display = 'block';
				} else {
					page.style.display = 'none';
				}
			});
		});
	});
}

function switchToRoomWindow(contact){
	document.getElementById('chatList').querySelectorAll('li').forEach(listItem => {
		if (contact.dataset.id === listItem.dataset.friend) {
			listItem.click();
			switch_SPA_Page('chat_window');
		}
	});
}

function switch_SPA_Page(page_id){
	document.getElementById('nav').querySelectorAll('li').forEach(navItem => {
		const linkItem = navItem.querySelector('a');
		if (linkItem.dataset.page == page_id){
			linkItem.click();
		}
	});
}

document.querySelectorAll('button.tst').forEach(button => {
	
	let channel_name = button.dataset.event;
	button.addEventListener('click', () => {
		socket.emit(channel_name, 666);
	})
});

document.getElementById('send_message_btn').addEventListener('click', (e) => {

	const roomId = document.getElementById('chat_form').getAttribute('data-room-id');
	const new_msg = document.getElementById('message').value;
	if (new_msg.length > 0 && new_msg !== '') {

		// console.log('posalji: ' + new_msg);

		let payload = {
			roomId: roomId,
			content: new_msg,
			sender: user_id
		}

		// console.log(payload);
		socket.emit(channels.send_message, payload);
	}
});



// primerak koriscenja socket callback ack
/*socket.on('client_online_response', (data, fn) => {
	console.log('data on channel "client_online_response"');
	console.log(data);

	const msg = 'client received message, this is acknowledgment from it.';
	const tmp_test = { data, msg };
	fn(tmp_test);
});*/