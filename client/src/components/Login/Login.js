import React, { Component } from 'react';
import { Pane, TextInputField, Button, Text, Link } from 'evergreen-ui';
import './Login.scss';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: ''
		};
	}

	handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const { email, password } = this.state;
			let user = await Axios.post('/login', { email: email, password: password });
			console.log(user);
			if (user.status === 200) {
				console.log('Login success.');
				localStorage.setItem('isSignedIn', true);
				localStorage.setItem('nameState', user.data.name);
				window.location.href = '/';
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return (
			<div className='login-container'>
				<Pane className='login-pane' elevation={1}>
					<form onSubmit={this.handleSubmit}>
						<h2>Login</h2>
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
						<Button type='submit' appearance='primary'>
							Login
						</Button>
						<Text marginTop={24} marginBottom={8} display='block' textAlign='center'>
							Forgot your password? <Link color='blue'>Reset your password</Link>
						</Text>
					</form>
				</Pane>
			</div>
		);
	}
}
