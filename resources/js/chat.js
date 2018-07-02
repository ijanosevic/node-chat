var host_url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

var user_id = docCookies.getItem('user_id');
if (!user_id){
	window.location = host_url;
} else {
	var socket = io('http://localhost:3000/');
	updateClientSocket(socket, user_id);

	socket.on('msg', function(data){
		console.log(data);
	});
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

function updateClientSocket(socket, user_id){
	getNewSocketId(socket)
		.then(socket_id => {
			var creds = {
				sid: socket_id,
				uid: user_id
			}
			socket.emit('update-user-socket', creds);
		})
		.catch(err => {
			console.log('NEuspesno');
			console.error(err);
		});
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