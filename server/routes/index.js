const router = require('express').Router();

module.exports = (passport) => {
	const forms = require('./forms')();

	// auth routes
	router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
		res.redirect('/');
	});

	// form routes
	router.post('/createForm', forms.createForm);

	return router;
};
