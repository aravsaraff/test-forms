import React, { Component } from 'react';
// import Question from './Question';
import Axios from 'axios';
import './Form.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

function Question(props) {
	let { currentIndex, answers, field } = props;
	console.log(answers[currentIndex]);

	if (field.type === 'single') {
		return (
			<div id='single' className='form-pane' key={currentIndex}>
				<div className='question'>{field.question}</div>

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
			</div>
		);
	} else if (field.type === 'multiple') {
		return (
			<div id='multiple' className='form-pane' key={currentIndex}>
				<div className='question'>{field.question}</div>

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
			</div>
		);
	} else {
		return (
			<div id='subjective' className='form-pane' key={props.currentIndex}>
				<div className='question'>{field.question}</div>

				<input
					type='text'
					id='answer'
					value={typeof answers[currentIndex] === 'object' ? '' : answers[currentIndex]}
					onChange={props.handleChange}
				/>
			</div>
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
			validId: false
		};
	}

	async componentDidMount() {
		try {
			let resp = await Axios.post('/fetchForm', { id: this.state.id });
			console.log(resp);
			if (resp.status === 200) {
				this.setState({
					form: resp.data,
					validId: true
				});
			}
			console.log(this.state);
		} catch (err) {
			console.log(err);
		}
	}

	handleSubmit = async (e) => {
		try {
			e.preventDefault();
			let { answers } = this.state;
			console.log(answers);
			let resp = await Axios.post('/checkForm', { id: this.state.id, answers: answers });
			console.log(resp.data);
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
		let { form, currentIndex, answers } = this.state;
		return (
			<div className='form-container'>
				<div className='meta'>
					<h1>{form.title}</h1>
					<h3>{form.description}</h3>
				</div>
				{form.fields && (
					<form onSubmit={this.handleSubmit}>
						<Question
							currentIndex={currentIndex}
							field={form.fields[currentIndex]}
							handleChange={this.handleChange}
							answers={answers}
						/>
						<button onClick={this.decrementIndex}>Prev</button>
						<button onClick={this.incrementIndex}>Next</button>
						<input type='submit' value='Submit' />
					</form>
				)}
			</div>
		);
	}
}
