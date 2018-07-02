var express = require('express');

var routes = function() {

	var contactRouter = express.Router();
	var contactController = require('../controllers/contactController');

	contactRouter.route('/add')
		.post(contactController.add)

	return contactRouter;
}

module.exports = routes;