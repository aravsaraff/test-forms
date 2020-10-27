const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session')({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
});
const passport = require('passport');
const express = require('express');

const app = express();
const routes = require('./routes')(passport);
require('dotenv').config();

const cors = require('cors');
const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

const port = process.env.PORT || 8888;

app.listen(port, (err) => {
	console.log(err || 'Listening on port ' + port);
});
