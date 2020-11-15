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
	router.post('/fetchForm', auth.ensure, forms.fetchForm);
	router.post('/checkForm', forms.checkForm);
	router.get('/submittedForms', auth.ensure, forms.fetchUserSubmissions);
	router.get('/fetchForms', auth.access, forms.fetchForms);
	router.post('/fetchResults', auth.access, forms.fetchResults);
	router.post('/fetchUserResults', auth.ensure, forms.fetchUserResults);
	router.post('/fetchUserResultsAdmin', auth.access, forms.fetchUserResultsAdmin);
	router.post('/subjectiveMarking', auth.access, forms.subjectiveMarking);

	return router;
};
