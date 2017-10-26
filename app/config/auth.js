'use strict';

module.exports = {
	'githubAuth': {
		'clientID': GITHUB_KEY,
		'clientSecret': GITHUB_SECRET,
		'callbackURL': APP_URL + 'auth/github/callback'
	}
};
