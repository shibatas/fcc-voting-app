'use strict';

var path = process.cwd();
//var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var Poll = require(path + '/app/controllers/poll.server.js');
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	//var clickHandler = new ClickHandler();
	var poll = new Poll();

	app.route('/')
		.get(/*isLoggedIn, */function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/poll/:id')
		.get(/*isLoggedIn, */function (req, res) {
			res.sendFile(path + '/public/poll.html');
		});

	app.route('/vote/:id/:choice')
		.get(poll.addClick)
		.delete(poll.resetClicks);

	app.route('/form*')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/form.html')})
		.post(isLoggedIn, poll.newPoll);

	app.route('/renderPolls')
		.get(poll.allPolls);

	app.route('/updatePoll')
		.post(isLoggedIn, poll.updatePoll);

	app.route('/renderPoll/:id')
		.get(poll.getPollById);

	app.route('/delete/:id')
		.get(isLoggedIn, poll.deletePoll);

	app.route('/ip')
		.get(poll.getIP);
};
