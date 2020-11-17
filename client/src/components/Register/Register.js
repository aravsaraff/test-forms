import React, { Component } from 'react';
import Axios from 'axios';
import { Pane, TextInputField, Button } from 'evergreen-ui';
import ReCAPTCHA from 'react-google-recaptcha';
import './Register.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

const recaptchaRef = React.createRef();

export default class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			passwordConfirmed: '',
			phone: ''
		};
	}

	handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const { firstName, lastName, email, password, passwordConfirmed, phone } = this.state;
			const token = await recaptchaRef.current.executeAsync();
			if (password !== passwordConfirmed) {
				// Passwords don't match!
				console.log("Passwords don't match.");
			} else {
				let resp = await Axios.post('/register', {
					name: firstName + ' ' + lastName,
					email: email,
					password: password,
					phone: phone,
					token: token
				});
				console.log(resp);
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return (
			<div className='register-container'>
				<Pane className='register-pane' elevation={1}>
					<form onSubmit={this.handleSubmit}>
						<h2>Register</h2>
						<TextInputField
							required
							name='first_name'
							label='First Name'
							inputHeight={30}
							inputWidth={250}
							onChange={(e) => this.setState({ firstName: e.target.value })}
							value={this.state.firstName}
						/>

						<TextInputField
							required
							name='last_name'
							label='Last Name'
							inputHeight={30}
							inputWidth={250}
							onChange={(e) => this.setState({ lastName: e.target.value })}
							value={this.state.lastName}
						/>

						<TextInputField
							required
							name='email'
							label='Email'
							inputHeight={30}
							inputWidth={250}
							onChange={(e) => this.setState({ email: e.target.value })}
							value={this.state.email}
						/>

						<TextInputField
							required
							type='password'
							name='password'
							label='Password'
							inputHeight={30}
							inputWidth={250}
							onChange={(e) => this.setState({ password: e.target.value })}
							value={this.state.password}
						/>

						<TextInputField
							required
							type='password'
							name='password_confirmation'
							label='Confirm Password'
							inputHeight={30}
							inputWidth={250}
							onChange={(e) => this.setState({ passwordConfirmed: e.target.value })}
							value={this.state.passwordConfirmed}
						/>

						<TextInputField
							required
							type='tel'
							name='phone'
							label='Mobile Number'
							inputHeight={30}
							inputWidth={250}
							onChange={(e) => this.setState({ phone: e.target.value })}
							value={this.state.phone}
						/>

						<ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey='6LfnPuEZAAAAANbADW2JK_7hw2i3cY8Op0sKvudN' />

						<Button type='submit' appearance='primary'>
							Sign Up
						</Button>
					</form>
				</Pane>
			</div>
		);
	}
}
