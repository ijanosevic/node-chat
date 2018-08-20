Notification = require('./notification');

class NotificationStatusOnline extends Notification{

	constructor(type, payload){
		super(type, payload);
		this.title = '__';
		this.color = '__';
		this.content = '__ user is online';
	}
}

module.exports = NotificationStatusOnline;