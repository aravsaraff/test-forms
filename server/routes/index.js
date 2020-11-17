const router = require('express').Router();

module.exports = (passport) => {
	const auth = require('./auth')(passport);
	const forms = require('./forms')();

	// auth routes
	router.post('/register', auth.register);
	router.post('/login', auth.login);
	router.get('/logout', auth.logout);

	// form routes
	router.post('/createForm', forms.createForm);
	router.post('/fetchForm', forms.fetchForm);
	router.post('/checkForm', forms.checkForm);
	router.get('/submittedForms', forms.fetchUserSubmissions);
	router.get('/fetchForms', forms.fetchForms);
	router.post('/fetchResults', forms.fetchResults);
	router.post('/fetchUserResults', forms.fetchUserResults);

	return router;
};
