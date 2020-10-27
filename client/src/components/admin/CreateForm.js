import React, { Component } from 'react';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class CreateForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			title: '',
			description: '',
			formFields: []
		};
	}

	addMCQ = (e) => {
		try {
			e.preventDefault();

			let addedQ = {
				type: 'mcq',
				question: e.target.mcq_question.value,
				options: [
					e.target.mcq_option1.value,
					e.target.mcq_option2.value,
					e.target.mcq_option3.value,
					e.target.mcq_option4.value
				],
				answers: [
					e.target.option1_correct.checked,
					e.target.option2_correct.checked,
					e.target.option3_correct.checked,
					e.target.option4_correct.checked
				]
			};
			console.log(addedQ);
			this.setState((prevState) => ({ formFields: [...prevState.formFields, addedQ] }));
		} catch (err) {
			console.log(err);
		}
	};

	addSubjective = (e) => {
		try {
			e.preventDefault();
			let addedQ = {
				type: 'subjective',
				question: e.target.subjective_question.value
			};
			console.log(addedQ);
			this.setState((prevState) => ({
				formFields: [...prevState.formFields, addedQ]
			}));
		} catch (err) {
			console.log(err);
		}
	};

	handleMeta = (e) => {
		try {
			e.preventDefault();
			this.setState({
				id: e.target.id.value,
				title: e.target.title.value,
				description: e.target.description.value
			});
		} catch (err) {
			console.log(err);
		}
	};

	createForm = async (e) => {
		try {
			e.preventDefault();
			const resp = await Axios.post('/createForm', this.state);
			if (resp.status === 200) {
				console.log('Successfully created form');
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return (
			<div>
				<form id='title-form' onSubmit={this.handleMeta}>
					<input type='text' name='id' placeholder='Quiz Link' />
					<input type='text' name='title' placeholder='Quiz Title' />
					<input type='text' name='description' placeholder='Quiz Description' />
					<input type='submit' value='Set Title/Description' />
				</form>

				<form id='mcq-form' onSubmit={this.addMCQ}>
					<input type='text' name='mcq_question' />
					<input type='checkbox' name='option1_correct' />
					<input type='text' name='mcq_option1' />
					<input type='checkbox' name='option2_correct' />
					<input type='text' name='mcq_option2' />
					<input type='checkbox' name='option3_correct' />
					<input type='text' name='mcq_option3' />
					<input type='checkbox' name='option4_correct' />
					<input type='text' name='mcq_option4' />
					<input type='submit' value='Add MCQ' />
				</form>

				<form id='subjective-form' onSubmit={this.addSubjective}>
					<input type='text' name='subjective_question' />
					<input type='submit' value='Add Subjective' />
				</form>

				<button onClick={this.createForm}> Create Form </button>
			</div>
		);
	}
}
