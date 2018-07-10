var socket = io();

var channel_names = {
	messages: 'public_ch',
	clients: 'clients_ch',
	info: 'info_ch',
	client: 'client_',
	message: 'msg_',
}

var nickname;
var offset = 0;
var nickname_input = document.getElementById('nickname');
var chat_form = document.getElementById('chat_form');
var login_form = document.getElementById('login_form');
var user_nickname = document.getElementById('user_nickname');
var user = localStorage.getItem('chat_user');
var chat_history = document.getElementById('messages');

if (!user) {

	login_form.querySelector('button').addEventListener('click', function(e){

		e.preventDefault();
		nickname = nickname_input.value;
		login_form.style.display = 'none';
		chat_form.style.display = 'block';
		user_nickname.querySelector('span').innerText = nickname;
		user_nickname.style.display = 'block';

		var user = {
			id: Math.floor(Math.random() * 999999),
			nickname: nickname
		};

		var message = {
			action: 'add',
			client: user
		};
		socket.emit(channel_names.clients, message);
		localStorage.setItem('chat_user', JSON.stringify(user));
		fetchOldMessages();
		chat_history.style.display = 'block';
	});
} else {
	user = JSON.parse(user);
	nickname = user.nickname;
	login_form.style.display = 'none';
	chat_form.style.display = 'block';
	user_nickname.querySelector('span').innerText = nickname;
	user_nickname.style.display = 'block';
	chat_history.style.display = 'block';

	fetchOldMessages();
}

chat_form.querySelector('button').addEventListener('click', function(e) {
	e.preventDefault();
	var message = {
			id: Math.floor(Math.random() * 999999),
			client: localStorage.getItem('chat_user'),
			content: document.getElementById('m').value
		};
	socket.emit(channel_names.messages, message);
	document.getElementById('m').value = '';
});

socket.on(channel_names.clients, function(msg){
	console.log('nesto se desilo sa klijentima stigao, ili otisao');
	console.log(msg);
});

socket.on(channel_names.messages, function(msg){
	renderMessage(msg);
});

socket.on(channel_names.info, function(msg){
	console.log(msg);
});

function fetchOldMessages(offset = 0){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:3000/fetch-old?offset='+offset);
	xhr.onload = function() {
	    if (xhr.status === 200) {
	        var messages = JSON.parse(xhr.responseText);
	        for (var i = messages.length - 1; i >= 0; i--) {
	        	renderMessage(messages[i]);
	        }
	        offset+=20;
	    }
	    else {
	        alert('Request failed.  Returned status of ' + xhr.status);
	    }
	};
	xhr.send();
}

function renderMessage(msg){

	let client_username = JSON.parse(msg.client).nickname;
	let message = msg.content;
	let time = prepareTime(msg.timestamp);
	var li = document.createElement("li");
	var textnode = document.createTextNode(client_username + " > " + message);
	li.appendChild(textnode);

	var span = document.createElement("span");
	span.className = 'tp';
	var textnode = document.createTextNode(time);
	span.appendChild(textnode);
	li.appendChild(span);

	chat_history.appendChild(li);
	chat_history.scrollTop = chat_history.scrollHeight;
}

function prepareTime(timestamp) {
	const time = new Date(parseInt(timestamp));
	const hours = (String(time.getHours()).length === 1) ? '0' + time.getHours() : time.getHours();
	const minutes = (String(time.getMinutes()).length === 1) ? '0' + time.getMinutes() : time.getMinutes();
	return hours + ':' + minutes;
}