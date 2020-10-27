var LocalStrategy = require('passport-local').Strategy;
const db = require('./conn');

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		return done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		db.User.find({ id: id }, (err, user) => {
			return done(err, user[0]);
		});
	});

	passport.use(
		new LocalStrategy((username, password, done) => {
			db.User.findOne({ username: username }, (err, user) => {
				if (err) return done(err);
				if (!user) return done(null, false);
				if (!user.verifyPassword(password)) return done(null, false);
				return done(null, user);
			});
		})
	);
};
