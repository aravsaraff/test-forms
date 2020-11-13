const db = require('../config/conn');

module.exports = () => {
	let exp = {};

	exp.createForm = async (req, res) => {
		try {
			console.log(req.body);
			let formData = req.body;
			let form = new db.Form({
				id: formData.id,
				title: formData.title,
				description: formData.description
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
					'fields.type': 1,
					'fields.question': 1,
					'fields.options': 1
				}
			);
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
					if (i === userAnswers[ind].length) userScore += 4;
					else userScore -= 1;
				} else if (obj.type === 'multiple') {
					var i;
					for (i = 0; userAnswers[ind][i] === obj.answer[i] && i < userAnswers[ind].length; i++);
					if (i === userAnswers[ind].length) userScore += 4;
					else userScore -= 1;
				}
			});
			console.log(userScore);

			let submission = new db.Submission({
				userId: req.user.email,
				formId: id,
				answer: userAnswers,
				score: userScore,
				checked: true
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
			if (!forms) return res.status(401).send('Error occurred.');
			return res.status(200).send(forms);
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchResults = async (req, res) => {
		try {
			let id = req.body.id;
			let results = await db.Submission.find({ formId: id });
			if (!results) return res.status(401).send('Error occurred.');
			return res.status(200).send(results);
		} catch (err) {
			console.log(err);
		}
	};

	exp.fetchUserSubmissions = async (req, res) => {
		try {
			let forms = await db.Submission.find({ userId: req.user.email, checked: true });
			if (!forms) return res.status(401).send('Error occurred.');
			return res.status(200).send(forms);
		} catch (err) {
			console.log(err);
		}
	};
	return exp;
};
