UserModel = require('../models/userModel');

class LoginController {

    login(req, res) {
        const user_data = req.body;
		

		UserModel.find(req.body.username, req.body.password)
			.then(result => {
				res.json(result);
			})
			.catch(err => {
				console.log(err);
				res.json(err);
			});
    }
}

module.exports = new LoginController();