import React, { Component } from 'react';
// import Question from './Question';
import { Button, Heading, Paragraph, Pane, Dialog } from 'evergreen-ui';
import Axios from 'axios';
import './Form.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;
Axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 401) {
			console.log('Not Authorized.');
			window.location.href = '/login?status=false';
		}
		return error;
	}
);

function Question(props) {
	let { currentIndex, answers, field } = props;
	console.log(answers[currentIndex]);

	if (field.type === 'single') {
		return (
			<Pane elevation={1} id='single' className='form-pane' key={currentIndex}>
				<Paragraph className='question'>{field.question}</Paragraph>

				<div className='option'>
					<input
						type='radio'
						id='op1'
						value='0'
						name={field.question}
						checked={answers[currentIndex][0]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op1'>{field.options[0]}</label>
				</div>

				<div className='option'>
					<input
						type='radio'
						id='op2'
						value='1'
						name={field.question}
						checked={answers[currentIndex][1]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op2'>{field.options[1]}</label>
				</div>

				<div className='option'>
					<input
						type='radio'
						id='op3'
						value='2'
						name={field.question}
						checked={answers[currentIndex][2]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op3'>{field.options[2]}</label>
				</div>

				<div className='option'>
					<input
						type='radio'
						id='op4'
						value='3'
						name={field.question}
						checked={answers[currentIndex][3]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op4'>{field.options[3]}</label>
				</div>
			</Pane>
		);
	} else if (field.type === 'multiple') {
		return (
			<Pane elevation={1} id='multiple' className='form-pane' key={currentIndex}>
				<Paragraph className='question'>{field.question}</Paragraph>

				<div className='option'>
					<input
						type='checkbox'
						id='op1'
						value='0'
						name='op1'
						checked={answers[currentIndex][0]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op1'>{field.options[0]}</label>
				</div>

				<div className='option'>
					<input
						type='checkbox'
						id='op2'
						value='1'
						name='op2'
						checked={answers[currentIndex][1]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op2'>{field.options[1]}</label>
				</div>

				<div className='option'>
					<input
						type='checkbox'
						id='op3'
						value='2'
						name='op3'
						checked={answers[currentIndex][2]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op3'>{field.options[2]}</label>
				</div>

				<div className='option'>
					<input
						type='checkbox'
						id='op4'
						value='3'
						name='op4'
						checked={answers[currentIndex][3]}
						onChange={props.handleChange}
					/>
					<label htmlFor='op4'>{field.options[3]}</label>
				</div>
			</Pane>
		);
	} else {
		return (
			<Pane elevation={1} id='subjective' className='form-pane' key={props.currentIndex}>
				<Paragraph className='question'>{field.question}</Paragraph>

				<textarea
					id='answer'
					value={typeof answers[currentIndex] === 'object' ? '' : answers[currentIndex]}
					onChange={props.handleChange}
					required
				/>
			</Pane>
		);
	}
}

export default class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: this.props.match.params.id,
			form: [],
			currentIndex: 0,
			answers: new Array(100).fill().map(function () {
				return new Array(4).fill(false);
			}),
			message: '',
			validId: false,
			isConfirm: false
		};
	}

	async componentDidMount() {
		let resp = await Axios.post('/fetchForm', { id: this.state.id });
		console.log(resp);
		if (resp.status === 200) {
			if (resp.data.message) {
				this.setState({ message: resp.data.message });
			} else {
				this.setState({
					form: resp.data,
					validId: true
				});
			}
		}
		console.log(this.state);
	}

	handleSubmit = async (e) => {
		try {
			e.preventDefault();
			let { answers } = this.state;
			console.log(answers);
			let resp = await Axios.post('/checkForm', { id: this.state.id, answers: answers });
			console.log(resp.data);
			window.location.href = '/';
		} catch (err) {
			console.log(err);
		}
	};

	decrementIndex = (e) => {
		try {
			e.preventDefault();
			let { currentIndex } = this.state;
			if (currentIndex > 0) this.setState({ currentIndex: this.state.currentIndex - 1 });
			console.log(this.state.currentIndex);
		} catch (err) {
			console.log(err);
		}
	};

	incrementIndex = (e) => {
		try {
			e.preventDefault();
			let { currentIndex, form } = this.state;
			if (currentIndex < form.fields.length - 1) this.setState({ currentIndex: this.state.currentIndex + 1 });
		} catch (err) {
			console.log(err);
		}
	};

	handleChange = (e) => {
		try {
			let { form, currentIndex, answers } = this.state;
			let qType = form.fields[currentIndex].type;
			if (qType === 'single') {
				answers[currentIndex] = [false, false, false, false];
				answers[currentIndex][parseInt(e.target.value)] = true;
			} else if (qType === 'multiple') {
				if (e.target.checked) {
					answers[currentIndex][parseInt(e.target.value)] = true;
				} else {
					answers[currentIndex][parseInt(e.target.value)] = false;
				}
			} else {
				answers[currentIndex] = e.target.value;
			}
			console.log(answers);
			this.setState({ answers: answers });
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		let { form, currentIndex, answers, message, isConfirm } = this.state;
		return (
			<div className='form-container'>
				<Dialog
					isShown={isConfirm}
					title='Are you sure?'
					onCloseComplete={() => this.setState({ isConfirm: false })}
					hasFooter={false}
				>
					<Paragraph margin='default'>Are you sure you want to submit? This process cannot be reverted.</Paragraph>
					<Button
						marginRight={16}
						appearance='primary'
						intent='danger'
						onClick={() => this.setState({ isConfirm: false })}
					>
						Cancel
					</Button>
					<Button type='submit' form='test-form' appearance='primary'>
						Submit
					</Button>
				</Dialog>
				<div className='meta'>
					<Heading size={900} margin='default'>
						{form.title}
					</Heading>
					<Heading size={700} margin='default'>
						{form.description}
					</Heading>
					<p>{message}</p>
				</div>
				{form.fields && (
					<form id='test-form' onSubmit={this.handleSubmit}>
						<Question
							currentIndex={currentIndex}
							field={form.fields[currentIndex]}
							handleChange={this.handleChange}
							answers={answers}
						/>
						<Button appearance='minimal' onClick={this.decrementIndex}>
							Prev
						</Button>
						<Button appearance='minimal' onClick={this.incrementIndex}>
							Next
						</Button>
						<Button
							appearance='default'
							onClick={(e) => {
								e.preventDefault();
								this.setState({ isConfirm: true });
							}}
						>
							Submit
						</Button>
					</form>
				)}
			</div>
		);
	}
}
