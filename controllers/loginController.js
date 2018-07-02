UserModel = require('../models/userModel');

class LoginController {

    login(req, res) {
        const user_data = req.body;
		

		UserModel.find(req.body.username, req.body.password)
			.then(result => {
				var response = {
					message: 'You are successfully logged in.',
					success: true,
					id: result
				}
				res.json(response);
			})
			.catch(err => {
				console.log(err);
				var response = {
					message: err,
					success: false
				}
				res.json(response);
			});
    }
}

module.exports = new LoginController();