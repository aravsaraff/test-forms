import React, { Component } from 'react';
import { Heading } from 'evergreen-ui';
import './NotFoundPage.scss';

export default class NotFoundPage extends Component {
	render() {
		return (
			<Heading className='not-found' size={500}>
				404: Page Not Found
			</Heading>
		);
	}
}
