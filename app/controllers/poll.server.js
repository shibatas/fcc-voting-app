'use strict';

var Users = require('../models/users.js');
var Questions = require('../models/questions.js');
var ip = require('ext-ip')();

function poll () {

	this.addClick = function (req, res) {
		var id = req.params['id'];
		var choiceNum = req.params['choice'];
		var name; //username or ip address of client

		//vote with username if logged in
		if (req.isAuthenticated()) {
			lookFor(req.user.github.username);
		} else { //vote with ipAddress, if not logged in
			ip.get().then(function(ipAddress) {
				lookFor(ipAddress);
			}, function(err) {
				console.error(err);
			});
		}

		function lookFor(name) {
			Questions
				.find({
					_id: id,
					voters: name
				})
				.exec(function(err, data) {
					console.log(data.length);
					if (data.length === 0) {
						vote(name);
					} else {
						res.send('already voted');
					}
				})
		}

		function vote(name) {
			console.log(name);
			Questions
				.findOneAndUpdate({
					_id: id,
					'choices.id': choiceNum},
					{
						$inc: {'choices.$.count': 1},
						$push: {'voters': name}
					})
				.exec(function (err, data) {
					if (err) {throw err;}
					res.send('vote saved');
				});
		}

	};

	this.resetClicks = function (req, res) {
		var id = req.params['id'];

		var query = {_id: id, 'choices.count': {$gt: 0}};
		var newData = {'choices.$.count': 0};

		Questions
			.find({_id: id},
			function (err, data) {
				if (err) {throw err}
				var num = data[0].choices.length;

				for (var i = 0; i < num; i++) {
					Questions.update(query, newData,
						function(err, data) {
							if (err) {throw err;}
						}
					);
				}

				Questions.update({_id: id},{voters: []},
					function(err, data) {
						if (err) {throw err;}
					}
				);

				res.send('reset');
			});
		console.log(id + ' has been reset');
	};

	this.newPoll = function (req, res) {

		var id;

		Questions.create(req.body, function (err, doc) {
			if (err) return err;
			id = JSON.stringify(doc._id);
			//console.log(id);
			res.send(id);
		});


		//res.send(id.toString());
	};

	this.allPolls = function (req, res) {
		var username = req.query.username;
		var useronly = (req.query.useronly == 'true');
		var query = {};

		if (useronly) {
				query = { 'username' : username }
		}

		Questions
			.find(query)
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	}

	this.getPollById = function (req, res) {
		var id = req.params['id'];

		Questions
			.find({_id: id})
			.exec(function (err, data) {
				if (err) { throw err; }
				res.json(data[0]);
			});
	};

	this.updatePoll = function (req, res) {

		var newPoll = req.body;
		//console.log(req.body);

		Questions
			.findOneAndUpdate(
				{_id: newPoll._id},
				newPoll,
				function(err, data) {
					if (err) { throw err; }
					res.json(data[0]);
				});
	};

	this.deletePoll = function (req, res) {
		var id = req.params['id'];

		Questions.findOneAndRemove({_id: id}, function (err) {
			if (err) {throw err; }
			else {console.log(id + " has been deleted"); }
		});

		res.redirect('/');
	};

	this.getIP = function (req, res) {
		ip.get().then(function(data) {
			res.send(data);
		}, function(err) {
			console.error(err);
		});
	}
}

module.exports = poll;
