import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Popover, Menu, Position } from 'evergreen-ui';
import banner from '../../assets/banner.png';
import './Header.scss';
import Axios from 'axios';

function Nav(props) {
	const isAuth = localStorage.getItem('isSignedIn');
	const name = localStorage.getItem('nameState');
	if (!isAuth) {
		return (
			<div className='nav-btns'>
				<Link to='/login'>
					<Button appearance='minimal' className='nav-login-btn'>
						Login
					</Button>
				</Link>
				<Link to='/register'>
					<Button appearance='minimal' className='nav-register-btn'>
						Register
					</Button>
				</Link>
			</div>
		);
	} else {
		return (
			<div className='nav-btns'>
				<Link to='/'>
					<Button appearance='minimal' className='nav-register-btn'>
						Home
					</Button>
				</Link>
				<Popover
					position={Position.BOTTOM_LEFT}
					content={
						<Menu>
							<Menu.Group>
								<Menu.Item onSelect={props.logout}>Logout</Menu.Item>
							</Menu.Group>
						</Menu>
					}
				>
					<Avatar name={name} size={35} marginRight={7} />
				</Popover>

				<p className='username'>{name}</p>
			</div>
		);
	}
}

export default class Header extends Component {
	logout = async () => {
		try {
			await Axios.get('/logout');
			localStorage.removeItem('isSignedIn');
			localStorage.removeItem('nameState');
			window.location.href = '/login';
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return (
			<div className='nav-container'>
				<img src={banner} className='nav-logo' alt='banner' />
				<Nav logout={this.logout} />
			</div>
		);
	}
}
