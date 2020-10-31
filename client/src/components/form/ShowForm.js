import React, { Component } from 'react';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class ShowForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: this.props.match.params.id,
			form: [],
			validId: false
		};
	}

	async componentDidMount() {
		try {
			let resp = await Axios.post('/fetchForm', { id: this.state.id });
			console.log(resp);
			if (resp.status === 200) {
				this.setState({ form: resp.data, validId: true });
			}
		} catch (err) {
			console.log(err);
		}
	}

	handleSubmit = (e) => {
		try {
			e.preventDefault();
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		let { form } = this.state;
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					{form.fields &&
						form.fields.map((obj, idx) => {
							if (obj.type === 'mcq') {
								return (
									<div id={idx}>
										<label htmlFor={obj.question}>{obj.question}</label>
										<input type='radio' id='op1' name={obj.question} value={obj.option1} />
										<label for='op1'>{obj.option1}</label>
										<input type='radio' id='op2' name={obj.question} value={obj.option2} />
										<label for='op2'>{obj.option2}</label>
										<input type='radio' id='op3' name={obj.question} value={obj.option3} />
										<label for='op3'>{obj.option3}</label>
										<input type='radio' id='op4' name={obj.question} value={obj.option4} />
										<label for='op4'>{obj.option4}</label>
									</div>
								);
							} else {
								return (
									<div id={idx}>
										<label htmlFor={obj.question}>{obj.question}</label>
										<input type='text' id='answer' />
									</div>
								);
							}
						})}
					<input type='submit' value='Submit' />
				</form>
			</div>
		);
	}
}
