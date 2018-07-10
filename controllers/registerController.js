// todo: replace this class
UserModel = require('../models/userModel');

class RegisterController {

    register(req, res) {
        const new_user_data = req.body;
        let new_user = new UserModel();
        new_user.create(new_user_data)
        	.then(data => {
        		res.json(data);
        	})
            .catch(err => {
        		console.log(err);
        		res.json(err);
        	})
        
    }

    checkAccountAvailability(req, res) {
    	UserModel.checkExistance(req.body.username, req.body.email)
    		.then((result) => {
				res.json(result);
			})
            .catch(error => {
				console.log(error);
				res.json(error);
			});
    	
    }
}

module.exports = new RegisterController();