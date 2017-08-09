'use strict';

var Users = require('../models/users.js');

function ClickHandler () {

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		let btn = 'nbrClicks.' + req.query.btn;
		let obj = {};
		obj[btn] = 1;
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: obj })
			.exec(function (err, result) {
					if (err) { throw err; }
					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		let obj = {};
		obj['nbrClicks.btn1'] = 0;
		obj['nbrClicks.btn2'] = 0;
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, obj)
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = ClickHandler;
