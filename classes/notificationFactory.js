const fs = require('fs');
UserFriends = require('../classes/userFriends');

class NotificationFactory {

	constructor(type){

		const className = `notification${type}.js`;
		const classesDir = `${__dirname}/`; 
		if (fs.existsSync(classesDir + className)) {

			let notificationClass = require(`./notification${type}.js`);
			let notificationInstance = new notificationClass(type);
			return notificationInstance;
		} else {
			if (err) throw (err)
		}
	}
}

module.exports = NotificationFactory;