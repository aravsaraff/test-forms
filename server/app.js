const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');

const app = express();

const cors = require('cors');
const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true
};
app.use(cors(corsOptions));

const expressSession = require('express-session')({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
});
app.use(expressSession);

const routes = require('./routes')(passport);
require('dotenv').config();

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

const port = process.env.PORT || 8888;

app.listen(port, (err) => {
	console.log(err || 'Listening on port: ' + port);
});
