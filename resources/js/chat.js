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

socket.on(channel_lookup.f_list, function(friend_list){

	var friend_list_ul = document.getElementById('friendList');
	for (var i = 0; i < friend_list.length; i++) {
		const friend = friend_list[i];
		let initials = friend.username.substr(0, 2).toUpperCase();
		let username = friend.username;
		let online_status = (friend.status === '0') ? '' : '<a href="#!" class="secondary-content"><i class="material-icons">blur_on</i></a>';
		let contact_html = `<li class="collection-item avatar">
								<i class="material-icons circle blue">${initials}</i>
								<span class="title">${username}</span>
								${online_status}
							</li>`;
		friend_list_ul.insertAdjacentHTML('beforeend', contact_html);
	}
});