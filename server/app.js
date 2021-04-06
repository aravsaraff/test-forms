const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const express = require('express');

const routes = require('./routes')(passport);
const redisStore = require('./config/redis')(session);

require('dotenv').config();

const app = express();

const sess = session({
	resave: false,
	saveUninitialized: false,
	secret: 'process.env.SESS_KEY',
	store: redisStore,
	cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
});

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true
};

app.use(cors(corsOptions));
app.use(sess);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

const port = process.env.PORT || 8888;

app.listen(port, (err) => {
	console.log(err || 'Listening on port: ' + port);
});
