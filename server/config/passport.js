const db = require('../config/conn');

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		return done(null, user.email);
	});

	passport.deserializeUser((email, done) => {
		db.User.find({ email: email }, (err, user) => {
			return done(err, user[0]);
		});
	});
};
