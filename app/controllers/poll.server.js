'use strict';

var Users = require('../models/users.js');
var Questions = require('../models/questions.js');

function poll () {

	this.addClick = function (req, res) {
		var id = req.params['id'];
		var choiceNum = req.params['choice'];
		console.log(id);
		console.log(choiceNum);
		
		Questions
			.findOneAndUpdate({
				_id: id, 
				'choices.id': choiceNum},
				{
					$inc: {'choices.$.count': 1}
				})
			.exec(function (err, data) {
				if (err) {throw err;}
				res.json(data);
			});
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
					});
				}
				
				res.send('reset');
			});
		console.log(id + ' has been reset');
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
		
		Questions
			.find({_id: id})
			.exec(function (err, data) {
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
		
		
		res.redirect('https://fcc-dynamic-web-app-shohei51.c9users.io/');
	};
}

module.exports = poll;
