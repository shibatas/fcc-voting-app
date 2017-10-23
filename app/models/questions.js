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
});

module.exports = mongoose.model('Question', Question);
