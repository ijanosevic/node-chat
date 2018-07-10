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


socket.on('friends', (data) => {
	console.log('data on channel "friends"');
	console.log(data);
});

socket.on('rooms', (data) => {
	console.log('data on channel "rooms"');
	console.log(data);
});

socket.on('correspondence', (data) => {
	console.log('data on channel "correspondence"');
	console.log(data);
});

socket.on('message', (data) => {
	console.log('data on channel "message"');
	console.log(data);
});

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
});

socket.on('disconnected', (data) => {
	console.log('changes on network, some of your friends just went offline');
	console.log(data);
});

document.querySelectorAll('button.tst').forEach(button => {
	
	let channel_name = button.dataset.event;
	button.addEventListener('click', () => {
		socket.emit(channel_name, 666);
	})
})