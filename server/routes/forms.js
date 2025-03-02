const db = require('../config/conn');

module.exports = () => {
	let exp = {};

	exp.createForm = async (req, res) => {
		try {
			console.log(req.body);
			let formData = req.body;
			let existingForm = await db.Form.findOne({ id: formData.id });
			if (existingForm) return res.status(409).send('A form already exists with this id.');
			let form = new db.Form({
				id: formData.id,
				title: formData.title,
				description: formData.description,
				start: formData.start,
				end: formData.end,
				positive: formData.positive,
				negative: formData.negative
			});
			await form.save();
			formData.formFields.forEach(async (obj) => {
				let field;
				if (obj.type === 'single' || obj.type === 'multiple') {
					field = new db.Field({
						type: obj.type,
						question: obj.question,
						options: obj.options,
						answer: obj.answer
					});
				} else {
					field = new db.Field({
						type: obj.type,
						question: obj.question
					});
				}
				await db.Form.findOneAndUpdate(
					{ id: formData.id },
					{
						$push: {
							fields: field
						}
					}
				);
			});
			return res.status(200).send('Success!');
		} catch (err) {
			console.log(err);
			return res.send(err);
		}
	};

	exp.updateForm = async (req, res) => {
		try {
			console.log(req.body);
			let formData = req.body;
			let exists = await db.Form.deleteOne({ id: formData.id });
			let form = new db.Form({
				id: formData.id,
				title: formData.title,
				description: formData.description,
				start: formData.start,
				end: formData.end,
				positive: formData.positive,
				negative: formData.negative
			});
			await form.save();
			formData.formFields.forEach(async (obj) => {
				let field;
				if (obj.type === 'single' || obj.type === 'multiple') {
					field = new db.Field({
						type: obj.type,
						question: obj.question,
						options: obj.options,
						answer: obj.answer
					});
				} else {
					field = new db.Field({
						type: obj.type,
						question: obj.question
					});
				}
				await db.Form.findOneAndUpdate(
					{ id: formData.id },
					{
						$push: {
							fields: field
						}
					}
				);
			});
			return res.status(200).send('Success!');
		} catch (err) {
			console.log(err);
			return res.send(err);
		}
	};

	exp.fetchForm = async (req, res) => {
		try {
			let id = req.body.id;
			let form = await db.Form.findOne(
				{ id: id },
				{
					id: 1,
					title: 1,
					description: 1,
					start: 1,
					end: 1,
					'fields.type': 1,
					'fields.question': 1,
					'fields.options': 1
				}
			);
			console.log(form);
			if (!form) {
				return res.status(404).send('Form not found.');
			}
			let submitted = await db.Submission.findOne({ userId: req.user.email, formId: id });
			if (submitted) return res.status(200).send({ message: 'You have already submitted this form once.' });
			//
			return res.status(200).send(form);
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchFormAdmin = async (req, res) => {
		try {
			let id = req.body.id;
			let form = await db.Form.findOne({ id: id });
			console.log(form);
			if (!form) {
				return res.status(404).send('Form not found.');
			}
			//
			return res.status(200).send(form);
		} catch (err) {
			console.log(err);
		}
	};

	exp.checkForm = async (req, res) => {
		try {
			console.log(req.user);
			let id = req.body.id;
			let form = await db.Form.findOne(
				{ id: id },
				{
					id: 1,
					title: 1,
					description: 1,
					positive: 1,
					negative: 1,
					'fields.type': 1,
					'fields.question': 1,
					'fields.options': 1,
					'fields.answer': 1
				}
			);
			if (!form) {
				return res.status(404).send('Form not found.');
			}

			let userAnswers = req.body.answers;
			let userScore = 0;
			form.fields.map((obj, ind) => {
				if (obj.type === 'single') {
					var i;
					for (i = 0; userAnswers[ind][i] === obj.answer[i] && i < userAnswers[ind].length; i++);
					if (i === userAnswers[ind].length) userScore += form.positive;
					else userScore -= form.negative;
				} else if (obj.type === 'multiple') {
					var i;
					for (i = 0; userAnswers[ind][i] === obj.answer[i] && i < userAnswers[ind].length; i++);
					if (i === userAnswers[ind].length) userScore += form.positive;
					else userScore -= form.negative;
				}
			});
			console.log(userScore);

			let submission = new db.Submission({
				userId: req.user.email,
				formId: id,
				answer: userAnswers,
				score: userScore,
				checked: false
			});
			await submission.save();

			return res.status(200).send({ score: userScore });
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchForms = async (req, res) => {
		try {
			let forms = await db.Form.find({}, { id: 1, title: 1 });
			if (!forms) return res.status(500).send('Error occurred.');
			return res.status(200).send(forms);
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchResults = async (req, res) => {
		try {
			let id = req.body.id;
			console.log(id);
			let results = await db.Submission.find({ formId: id });
			if (!results) return res.status(500).send('Error occurred.');
			return res.status(200).send(results);
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchUserSubmissions = async (req, res) => {
		try {
			let forms = await db.Submission.find({ userId: req.user.email, checked: true });
			if (!forms) return res.status(500).send('Error occurred.');
			return res.status(200).send(forms);
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchUserResults = async (req, res) => {
		try {
			let id = req.body.id;
			console.log(id);
			let results = await db.Submission.findOne({ userId: req.user.email, formId: id });
			let form = await db.Form.findOne({ id: id });
			if (!results) return res.status(500).send('Error occurred.');
			console.log(form, results);
			return res.status(200).send({ form: form, results: results });
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchUserResultsAdmin = async (req, res) => {
		try {
			let id = req.body.id;
			let user = req.body.user;
			console.log(id, user);
			let results = await db.Submission.findOne({ userId: user, formId: id });
			let form = await db.Form.findOne({ id: id });
			if (!results) return res.status(500).send('Error occurred.');
			console.log(form, results);
			return res.status(200).send({ form: form, results: results });
		} catch (err) {
			console.log(err);
		}
	};

	exp.subjectiveMarking = async (req, res) => {
		try {
			let id = req.body.id;
			let user = req.body.user;
			let marks = req.body.marks;

			console.log(id, user);
			let update = await db.Submission.findOneAndUpdate({ userId: user, formId: id }, { $inc: { score: marks } });
			if (!update) return res.status(500).send('There was an error in updating.');
			return res.status(200).send('Score successfully updated');
		} catch (err) {
			console.log(err);
		}
	};

	exp.markChecked = async (req, res) => {
		try {
			let id = req.body.id;
			let user = req.body.user;
			let update = await db.Submission.findOneAndUpdate({ userId: user, formId: id }, { $set: { checked: true } });
			if (!update) return res.status(500).send('There was an error in updating.');
			return res.status(200).send('Form marked as checked!');
		} catch (err) {
			console.log(err);
		}
	};

	exp.getTime = async (req, res) => {
		try {
			let date = new Date;
			console.log(date);
			return res.status(200).send(date);
		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}
	}

	return exp;
};
