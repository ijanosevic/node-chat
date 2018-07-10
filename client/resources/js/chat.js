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

var channel_lookup = {
	online: 'client_online',				// =----->  klijent je povezan na server
	f_list: 'friends_list'					// =----->  slanje spiska i statusa prijatelja nakon sto je uspostavljena inicijalna konekcija
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
			socket.emit(channel_lookup.online, creds);
		})
		.catch(err => {
			console.log('NEuspesno');
			console.error(err);
		});
}

var socket = io('http://localhost:3000/');
updateClientSocket(socket, user_id);

socket.on(channel_lookup.online, function(data){

	var account_details_ul = document.getElementById('account_details');
	for (let key in data){
		let node = document.createElement("li");
		let textnode = document.createTextNode(key + ': ' + data[key]);
		node.appendChild(textnode);
		account_details_ul.appendChild(node);
	}
});

socket.on(channel_lookup.f_list, function(data){

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
});