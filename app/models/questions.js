'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Choices = new Schema({
	"id": Number,
	"choice": String,
	"count": 0
});

var Question = new Schema({
	id: Number,
	username: String,
	question: String,
	choices: [Choices]
}, {
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true
  }
});

//This virtual property keeps the total number of votes
Question.virtual('total').get(function() {
	var sum = this.choices.reduce(function(a, b) {
		return a + b.count;
	}, 0);
	return sum;
})

module.exports = mongoose.model('Question', Question);
