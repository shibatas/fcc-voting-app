'use strict';

var Users = require('../models/users.js');
var Questions = require('../models/questions.js');

function poll () {
	
	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': 26139392 }, { '_id': false })
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
			.findOneAndUpdate({ 'github.id': 26139392 }, { $inc: obj })
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
			.findOneAndUpdate({ 'github.id': 26139392 }, obj)
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.newQuestion = function (req, res) {
		
		var id;

		Questions.create(req.body, function (err, doc) {
			if (err) return err;
			id = JSON.stringify(doc._id);
			console.log(id);
			res.send(id);
		});
		

		//res.send(id.toString());
	};
	
	this.getQuestions = function (req, res) {
		Questions
			.find({})
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};
	
	this.getPoll = function (req, res) {
		var id = req.params['id'];
		console.log(id);
		Questions
			.find({_id: id})
			.exec(function (err, data) {
				if (err) { throw err; }
				res.json(data[0]);
			});
	};
}

module.exports = poll;
