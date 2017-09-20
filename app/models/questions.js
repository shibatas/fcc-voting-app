'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Question = new Schema({
	id: Number,
	question: String,
	choices: {
	    '1': [String, Number],
	    '2': [String, Number],
	    '3': [String, Number],
	    '4': [String, Number],
	    '5': [String, Number]
	}
});

module.exports = mongoose.model('Question', Question);
