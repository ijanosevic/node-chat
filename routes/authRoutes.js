var express = require('express');

var routes = function() {

	var authRouter = express.Router();
	var loginController = require('../controllers/loginController');
	// var registerController = require('../controllers/registerController');

	// authRouter.route('/register')
	// 	.post(registerController.register)

	authRouter.route('/login')
		.post(loginController.login);

	// authRouter.route('/check-username-availability')
	// 	.post(registerController.checkAccountAvailability);

	return authRouter;
}

module.exports = routes;