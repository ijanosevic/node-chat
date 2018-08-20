const createChatRoomBtn = document.getElementById('createChatRoomBtn');
const chatInfoBtn = document.getElementById('chatInfoBtn');
const startRoomBtn = document.getElementById('startRoomBtn');
const addNewContactBtn = document.getElementById('addNewContactBtn');

let selectableContactList = document.getElementById('selectableContactList').querySelector('ul.collection');
let contactList = document.getElementById('contactList').querySelector('ul.collection');
let chatRoomList = document.getElementById('chatRoomList').querySelector('ul.collection');
let chatBoxWrapper = document.getElementById('chatBoxWrapper');
let chatBoxHeader = document.getElementById('chatBoxHeader');
let chatBoxInfoWrapper = document.getElementById('chatBoxInfoWrapper');
let sidebarOverlayWrapper = document.getElementById('sidebarOverlayWrapper')
let newRoomOverlayWrapper = document.getElementById('newRoomOverlayWrapper')
let chatContent = document.querySelector('.chat-content');
let chatContentHtml = chatContent.querySelector('ul');
let newContactOverlayWrapper = document.getElementById('newContactOverlayWrapper');

let filterChatRoomsInput = document.querySelector('input[name="filterChatRooms"]');
let filterSelectableContactsInput = document.querySelector('input[name="filterContacts"]');
let filterContactsInput = document.querySelector('input[name="contact"]');