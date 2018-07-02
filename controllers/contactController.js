UserModel = require('../models/userModel');

class ContactController {

    add(req, res) {

		UserModel.checkExistance(req.body.email)
			.then(result => {

				UserModel.addFriend(req.cookies.user_id, req.body.email)
					.then(data => {
						res.json(data);
					})
					.catch(err => {
						res.json(err);
					});
			})
			.catch(err => {
				console.log(err);
				res.json(err);
			});
    }
}

module.exports = new ContactController();