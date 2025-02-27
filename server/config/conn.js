const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/forms', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
	console.log('Mongoose is connected.');
});

mongoose.connection.on('error', (err) => {
	console.log(err, 'Mongoose failed to connect.');
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose is disconnected.');
});

let exp = {};

const UserSchema = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
	phone: String,
	access: Number
});

const FieldSchema = new mongoose.Schema({
	type: String,
	question: String,
	options: [String],
	answer: [Boolean]
});

const FormSchema = new mongoose.Schema({
	id: String,
	title: String,
	description: String,
	fields: [FieldSchema],
	start: Date,
	end: Date,
	positive: Number,
	negative: Number
});

const SubmissionSchema = new mongoose.Schema({
	userId: String,
	formId: String,
	answer: Array,
	score: Number,
	checked: Boolean
});

exp.User = mongoose.model('User', UserSchema);
exp.Field = mongoose.model('Field', FieldSchema);
exp.Form = mongoose.model('Form', FormSchema);
exp.Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = exp;
