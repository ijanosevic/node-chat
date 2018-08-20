const fs = require('fs');
UserFriends = require('../classes/userFriends');

class Notification {

	constructor(type){

		this.type = type;
		this.data = undefined;
		this.results = {};
		this.time = Date.now(); // ovo vreme je lokalno na serveru, objediniti sva vremena da rade po 1 satu
		// console.log('stampam iz bazne notifikacione klase');
	}

	addData(key, data){
		this.results[key] = data;
	}
}

module.exports = Notification;