import React, { Component } from 'react';

export default class Submission extends Component {
	constructor(props) {
		super(props);

		this.state = {
			form: props.form
		};
	}

	render() {
		console.log(this.state.form);
		return <div></div>;
	}
}
