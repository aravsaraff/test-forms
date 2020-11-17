import React, { Component } from 'react';
import Axios from 'axios';
import Datetime from 'react-datetime';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class CreateForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			title: '',
			description: '',
			formFields: [],
			start: null,
			end: null
		};
	}

	editSingle = (e, ind) => {
		e.preventDefault();

			let editedQ = {
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
			console.log(editedQ);
			let { formFields } = this.state;
			formFields[ind] = editedQ;
			this.setState({ formFields });
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

	editSubjective = (e, idx) => {
		e.preventDefault();
		let editedQ = {
			type: 'subjective',
			question: e.target.question.value
		};
		console.log(editedQ);
		let { formFields } = this.state;
		formFields[idx] = editedQ;
		this.setState({ formFields });
	}

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

	editMultiple = (e, idx) => {
		e.preventDefault();
		let editedQ = {
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
		console.log(editedQ);
		let { formFields } = this.state;
		formFields[idx] = editedQ;
		this.setState({ formFields });
	}

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

	deleteField = (idx) => {
		let { formFields } = this.state;
		formFields.splice(idx, 1);
		this.setState({ formFields });
	}

	render() {
		let { formFields } = this.state;
		return (
			<div>
				
				<form id='title-form' onSubmit={this.handleMeta}>
					<input type='text' name='id' placeholder='Quiz Link' />
					<input type='text' name='title' placeholder='Quiz Title' />
					<input type='text' name='description' placeholder='Quiz Description' />
					<input type='submit' value='Set Title/Description' />
				</form>

				{
					formFields.map((ele, idx) => {
						if(ele.type === 'single')
							return (
								<form id='single-form' onSubmit={(e) => this.editSingle(e, idx)}>
									<input type='text' name='question' defaultValue={ele.question}/>
									<input type='radio' id='option1' name='correct' defaultChecked={ele.answer[0]}/>
									<input type='text' name='single_option1' defaultValue={ele.options[0]}/>
									<input type='radio' id='option2' name='correct' defaultChecked={ele.answer[1]}/>
									<input type='text' name='single_option2' defaultValue={ele.options[1]}/>
									<input type='radio' id='option3' name='correct' defaultChecked={ele.answer[2]}/>
									<input type='text' name='single_option3' defaultValue={ele.options[2]}/>
									<input type='radio' id='option4' name='correct' defaultChecked={ele.answer[3]}/>
									<input type='text' name='single_option4' defaultValue={ele.options[3]}/>
									<input type='submit' value='Edit' />
									<button onClick={() => this.deleteField(idx)}>Delete</button>
								</form>
							)
						else if(ele.type === 'multiple')
							return (
								<form id='multiple-form' onSubmit={(e) => this.editMultiple(e, idx)}>
									<input type='text' name='question' defaultValue={ele.question}/>
									<input type='checkbox' name='option1' defaultChecked={ele.answer[0] && 'true'}/>
									<input type='text' name='multiple_option1' defaultValue={ele.options[0]}/>
									<input type='checkbox' name='option2' defaultChecked={ele.answer[1] && 'true'}/>
									<input type='text' name='multiple_option2' defaultValue={ele.options[1]}/>
									<input type='checkbox' name='option3' defaultChecked={ele.answer[2] && 'true'}/>
									<input type='text' name='multiple_option3' defaultValue={ele.options[2]}/>
									<input type='checkbox' name='option4' defaultChecked={ele.answer[3] && 'true'}/>
									<input type='text' name='multiple_option4' defaultValue={ele.options[3]}/>
									<input type='submit' value='Edit' />
									<button onClick={() => this.deleteField(idx)}>Delete</button>
								</form>
							)
						else if(ele.type === 'subjective')
							return (
								<form id='subjective-form' onSubmit={(e) => this.editSubjective(e, idx)}>
									<input type='text' name='question' defaultValue={ele.question}/>
									<input type='submit' value='Edit' />
									<button onClick={() => this.deleteField(idx)}>Delete</button>
								</form>
							)
					}
					)
				}
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

				<Datetime onChange={(value) => this.setState({start: value.toDate() })} />

				<Datetime onChange={(value) => this.setState({end: value.toDate() }) } />

			</div>
		);
	}
}
