'use strict';

var Users = require('../models/users.js');
var Questions = require('../models/questions.js');

function ClickHandler () {

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': "26139392" }, { '_id': false })
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
			.findOneAndUpdate({ 'github.id': "26139392" }, { $inc: obj })
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
			.findOneAndUpdate({ 'github.id': "26139392" }, obj)
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = ClickHandler;
