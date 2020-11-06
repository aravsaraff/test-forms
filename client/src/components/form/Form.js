import React, { Component } from 'react';
// import Question from './Question';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

function Question(props) {
	if (props.field.type === 'single') {
		return (
			<div id='single' key={props.currentIndex} onChange={props.handleChange}>
				<p>{props.field.question}</p>
				<input type='radio' id='op1' value='0' name={props.field.question} />
				<label htmlFor='op1'>{props.field.options[0]}</label>
				<br />
				<input type='radio' id='op2' value='1' name={props.field.question} />
				<label htmlFor='op2'>{props.field.options[1]}</label>
				<br />
				<input type='radio' id='op3' value='2' name={props.field.question} />
				<label htmlFor='op3'>{props.field.options[2]}</label>
				<br />
				<input type='radio' id='op4' value='3' name={props.field.question} />
				<label htmlFor='op4'>{props.field.options[3]}</label>
			</div>
		);
	} else if (props.field.type === 'multiple') {
		return (
			<div id='multiple' key={props.currentIndex} onChange={props.handleChange}>
				<p>{props.field.question}</p>
				<input type='checkbox' id='op1' value='0' name='op1' />
				<label htmlFor='op1'>{props.field.options[0]}</label>
				<br />
				<input type='checkbox' id='op2' value='1' name='op2' />
				<label htmlFor='op2'>{props.field.options[1]}</label>
				<br />
				<input type='checkbox' id='op3' value='2' name='op3' />
				<label htmlFor='op3'>{props.field.options[2]}</label>
				<br />
				<input type='checkbox' id='op4' value='3' name='op3' />
				<label htmlFor='op4'>{props.field.options[3]}</label>
			</div>
		);
	} else {
		return (
			<div id='subjective' key={props.currentIndex} onChange={props.handleChange}>
				<p>{props.field.question}</p>
				<input type='text' id='answer' />
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
			answers: [],
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
		} catch (err) {
			console.log(err);
		}
	}

	handleSubmit = async (e) => {
		try {
			e.preventDefault();
			let { answers } = this.state;
			let resp = await Axios.post('/checkForm', { id: this.state.id, answers: answers });
			console.log(answers);
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
				answers[currentIndex] = parseInt(e.target.value);
			} else if (qType === 'multiple') {
				if (!answers[currentIndex]) {
					answers[currentIndex] = [];
				}
				answers[currentIndex].push(e.target.value);
			} else {
				answers[currentIndex] = e.target.value;
			}
			this.setState({ answers: answers });
			console.log(answers);
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		let { form, currentIndex, answers } = this.state;
		return (
			<div>
				<h1>{form.title}</h1>
				<h3>{form.description}</h3>
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
