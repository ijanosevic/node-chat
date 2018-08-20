var instance = M.Tabs.init(document.getElementById('navTabs'), {
	onShow: () => {
		revealBaseLayout();
		console.log(`Tab ${(instance.index + 1)} active.`);
	}
});

function revealBaseLayout(){
	newContactOverlayWrapper.classList.add('hidden');
	sidebarOverlayWrapper.classList.add('hidden');
	newRoomOverlayWrapper.classList.add('hidden');
	chatBoxWrapper.classList.remove('hidden');
	chatBoxInfoWrapper.classList.remove('hidden');
}

function showNewContactFormOverlay(){
	chatBoxWrapper.classList.add('hidden');
	chatBoxInfoWrapper.classList.add('hidden');
	newContactOverlayWrapper.classList.remove('hidden');
}

function showNewRoomOverlay(){
	sidebarOverlayWrapper.classList.remove('hidden');
	newRoomOverlayWrapper.classList.remove('hidden');
	chatBoxWrapper.classList.add('hidden');
	chatBoxInfoWrapper.classList.add('hidden');
}

function fetch(channel, id, payload = {}){
	console.log(`fetch ${channel}`);
	var data = { id }
	socket.emit(channel, data);
}

function updateChatRoomHtml(payload, room_members){
	
	console.log('updateChatRoomHtml');
	const data = payload.results;
	if (data.initial === true) {
		console.log(data);
		console.log('inicijalno');
		chatContentHtml.innerHTML = '';
	} else {
		console.log('sad vec nije');
	}

	for (message of data.correspondence) {
		let message_html = message_container_html_tmpl;
		

		let class_name = '';
		if (message.sender === user_id) {
			class_name = 'me';
		}

		let contact;
		for (var i = 0; i < room_members.length; i++) {
			if (room_members[i].id === message.sender){
				contact = room_members[i];
			}
		}

		const initials = contact.first_name.substr(0, 1) + contact.last_name.substr(0, 1);

		message_html = message_html.replace(/%className%/, class_name);
		message_html = message_html.replace(/%initials%/, initials);
		message_html = message_html.replace(/%content%/, message.content);
		message_html = message_html.replace(/%time%/, message.created_at);
		chatContentHtml.insertAdjacentHTML('afterbegin', message_html);
	}
}

function createContactListHtml(contacts){

	let contactListInnerHtml = '';
	for (contact of contacts) {
		let contact_li_html = contact_list_item_html_tmpl;
		contact_li_html = contact_li_html.replace(/%id%/, contact.id);
		contact_li_html = contact_li_html.replace(/%picture_url%/, contact.profile_picture_url);
		contact_li_html = contact_li_html.replace(/%title%/, contact.first_name);
		contact_li_html = contact_li_html.replace(/%time%/, contact.last_active);
		contactListInnerHtml += contact_li_html;
	}

	// append liste
	contactList.insertAdjacentHTML('beforeend', contactListInnerHtml);
}

function createChatRoomListHtml(chatRooms){
	let contactListInnerHtml = '';
	for (room of chatRooms) {
		let chat_room_li_html = chat_room_list_item_html_tmpl;
		chat_room_li_html = chat_room_li_html.replace(/%id%/, room.id);
		chat_room_li_html = chat_room_li_html.replace(/%picture_url%/, room.picture_url); 
		chat_room_li_html = chat_room_li_html.replace(/%title%/, room.title);
		chat_room_li_html = chat_room_li_html.replace(/%last_message%/, room.correspondence[0].content);
		contactListInnerHtml += chat_room_li_html;
	}

	// append liste
	chatRoomList.insertAdjacentHTML('beforeend', contactListInnerHtml);
	chatRoomList.querySelector('li').click();
}

function createSelectableContactListHtml(contacts){

	// remove inner html of selected contacts sidebar and main content
	selectableContactList.innerHTML = '';
	newRoomOverlayWrapper.querySelector('.selected-contacts-wrapper').innerHTML = '';

	let contactListInnerHtml = '';
	for (contact of contacts) {
		let contact_li_html = selectable_contact_list_item_html_tmpl;
		contact_li_html = contact_li_html.replace(/%id%/, contact.id);
		contact_li_html = contact_li_html.replace(/%picture_url%/, contact.profile_picture_url);
		contact_li_html = contact_li_html.replace(/%title%/, contact.first_name);
		contact_li_html = contact_li_html.replace(/%time%/, contact.last_active);
		contactListInnerHtml += contact_li_html;
	}
	// append liste
	selectableContactList.insertAdjacentHTML('beforeend', contactListInnerHtml);
}

function clientToFromRoom(el){
	
	let checkbox = el.querySelector('input');
	const contactId = el.dataset.id;
	let contact = getContacts()
		.filter(contact => contact.id == contactId)
		.pop();

	if (checkbox.checked == false) {
		checkbox.checked = true;
		
		let selected_contact_html = selected_contact_html_tmpl;
		selected_contact_html = selected_contact_html.replace(/%id%/, contact.id);
		selected_contact_html = selected_contact_html.replace(/%picture_url%/, contact.profile_picture_url);
		selected_contact_html = selected_contact_html.replace(/%title%/, contact.first_name);
		selected_contact_html = selected_contact_html.replace(/%time%/, contact.last_active);

		newRoomOverlayWrapper.querySelector('.selected-contacts-wrapper').insertAdjacentHTML('beforeend', selected_contact_html);
	} else {
		checkbox.checked = false;

		newRoomOverlayWrapper.querySelector(`[data-id="${contactId}"]`).remove();
	}

	checkRoomMembersCount();
}

function removeFromRoom(el){
	const contactId = el.dataset.id;
	el.remove();

	selectableContactList.querySelector(`[data-id="${contactId}"] input`).checked = false;
	checkRoomMembersCount();
}

function checkRoomMembersCount(){

	const selected_contacts = newRoomOverlayWrapper.querySelector('.selected-contacts-wrapper').querySelectorAll('a');

	if (selected_contacts.length < 1) {

		startRoomBtn.classList.add('disabled');
	} else {

		startRoomBtn.classList.remove('disabled');

		if (selected_contacts.length > 1) {
			newRoomOverlayWrapper.querySelector('.title').classList.add('hidden');
			newRoomOverlayWrapper.querySelector('.group-title-wrapper').classList.remove('hidden');
		} else {
			newRoomOverlayWrapper.querySelector('.title').classList.remove('hidden');
			newRoomOverlayWrapper.querySelector('.group-title-wrapper').classList.add('hidden');
		}
	}
}

