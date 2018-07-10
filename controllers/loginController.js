UserAuthenticate = require('../classes/userAuthenticate');

class LoginController {

    login(req, res) {

    	UserAuthenticate.login(req.body.email, req.body.password)
			.then(user => {
				
				delete user.password;
				delete user.room_list;
				delete user.friend_list;
				delete user.last_active;

				// todo: created_at is generated on server, client should receive localized time
				user.created_at = new Date(parseInt(user.created_at));

				var response = {
					message: 'You are successfully logged in.',
					success: true,
					data: user
				}
				res.json(response);
			})
			.catch(err => {

				console.log(err);
				throw err;

				var response = {
					message: 'Wrong credentials',
					success: false
				}
				res.json(response);

			});
    }
}

module.exports = new LoginController();