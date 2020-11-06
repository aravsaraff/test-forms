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

	exp.checkForm = async (req, res) => {};
	exp.fetchResult = async (req, res) => {};

	return exp;
};
