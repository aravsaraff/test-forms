import React, { Component } from 'react';
import Axios from 'axios';
// import Datetime from 'react-datetime';

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

	addSingle = (e) => {
		try {
			e.preventDefault();

			let addedQ = {
				type: 'single',
				question: e.target.question.value,
				options: [
					e.target.single_option1.value,
					e.target.single_option2.value,
					e.target.single_option3.value,
					e.target.single_option4.value
				],
				answer: [e.target.option1.checked, e.target.option2.checked, e.target.option3.checked, e.target.option4.checked]
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
				question: e.target.question.value
			};
			console.log(addedQ);
			this.setState((prevState) => ({
				formFields: [...prevState.formFields, addedQ]
			}));
		} catch (err) {
			console.log(err);
		}
	};

	addMultiple = (e) => {
		try {
			e.preventDefault();

			let addedQ = {
				type: 'multiple',
				question: e.target.question.value,
				options: [
					e.target.multiple_option1.value,
					e.target.multiple_option2.value,
					e.target.multiple_option3.value,
					e.target.multiple_option4.value
				],
				answer: [e.target.option1.checked, e.target.option2.checked, e.target.option3.checked, e.target.option4.checked]
			};
			console.log(addedQ);
			this.setState((prevState) => ({ formFields: [...prevState.formFields, addedQ] }));
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
				console.log('Successfully created form.');
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

				<form id='single-form' onSubmit={this.addSingle}>
					<input type='text' name='question' />
					<input type='radio' id='option1' name='correct' />
					<input type='text' name='single_option1' />
					<input type='radio' id='option2' name='correct' />
					<input type='text' name='single_option2' />
					<input type='radio' id='option3' name='correct' />
					<input type='text' name='single_option3' />
					<input type='radio' id='option4' name='correct' />
					<input type='text' name='single_option4' />
					<input type='submit' value='Add Single' />
				</form>

				<form id='multiple-form' onSubmit={this.addMultiple}>
					<input type='text' name='question' />
					<input type='checkbox' name='option1' />
					<input type='text' name='multiple_option1' />
					<input type='checkbox' name='option2' />
					<input type='text' name='multiple_option2' />
					<input type='checkbox' name='option3' />
					<input type='text' name='multiple_option3' />
					<input type='checkbox' name='option4' />
					<input type='text' name='multiple_option4' />
					<input type='submit' value='Add Multiiple' />
				</form>

				<form id='subjective-form' onSubmit={this.addSubjective}>
					<input type='text' name='question' />
					<input type='submit' value='Add Subjective' />
				</form>
				<button onClick={this.createForm}> Create Form </button>
				{/* <Datetime /> */}
			</div>
		);
	}
}
