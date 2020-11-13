import React, { Component } from 'react';
import Axios from 'axios';
import './Submission.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;

function Question(props) {
	let { currentIndex, answers, field } = props;
	console.log(answers[currentIndex]);

	if (field.type === 'single') {
		return (
			<div id='single' className='form-pane' key={currentIndex}>
				<div className='question'>{field.question}</div>

				<div className='option'>
					<input type='radio' id='op1' value='0' name={field.question} checked={answers[currentIndex][0]} readOnly />
					<label htmlFor='op1'>{field.options[0]}</label>
				</div>

				<div className='option'>
					<input type='radio' id='op2' value='1' name={field.question} checked={answers[currentIndex][1]} readOnly />
					<label htmlFor='op2'>{field.options[1]}</label>
				</div>

				<div className='option'>
					<input type='radio' id='op3' value='2' name={field.question} checked={answers[currentIndex][2]} readOnly />
					<label htmlFor='op3'>{field.options[2]}</label>
				</div>

				<div className='option'>
					<input type='radio' id='op4' value='3' name={field.question} checked={answers[currentIndex][3]} readOnly />
					<label htmlFor='op4'>{field.options[3]}</label>
				</div>
			</div>
		);
	} else if (field.type === 'multiple') {
		return (
			<div id='multiple' className='form-pane' key={currentIndex}>
				<div className='question'>{field.question}</div>

				<div className='option'>
					<input type='checkbox' id='op1' value='0' name='op1' checked={answers[currentIndex][0]} readOnly />
					<label htmlFor='op1'>{field.options[0]}</label>
				</div>

				<div className='option'>
					<input type='checkbox' id='op2' value='1' name='op2' checked={answers[currentIndex][1]} readOnly />
					<label htmlFor='op2'>{field.options[1]}</label>
				</div>

				<div className='option'>
					<input type='checkbox' id='op3' value='2' name='op3' checked={answers[currentIndex][2]} readOnly />
					<label htmlFor='op3'>{field.options[2]}</label>
				</div>

				<div className='option'>
					<input type='checkbox' id='op4' value='3' name='op4' checked={answers[currentIndex][3]} readOnly />
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
					readOnly
				/>
			</div>
		);
	}
}

export default class Submission extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: this.props.match.params.id,
			form: [],
			currentIndex: 0,
			answers: [],
			message: '',
			validId: false
		};
	}

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

	async componentDidMount() {
		try {
			let resp = await Axios.post('/fetchUserResults', { id: this.state.id });
			console.log(resp.data);
			if (resp.status === 200) {
				this.setState({
					form: resp.data.form,
					answers: resp.data.results.answer,
					validId: true
				});
			}
			console.log(this.state);
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		let { form, currentIndex, answers, message } = this.state;
		return (
			<div className='form-container'>
				<div className='meta'>
					<h1>{form.title}</h1>
					<h3>{form.description}</h3>
					{/* <p>{message}</p> */}
				</div>
				{form.fields && (
					<form>
						<Question currentIndex={currentIndex} field={form.fields[currentIndex]} answers={answers} />
						<button onClick={this.decrementIndex}>Prev</button>
						<button onClick={this.incrementIndex}>Next</button>
					</form>
				)}
			</div>
		);
	}
}
