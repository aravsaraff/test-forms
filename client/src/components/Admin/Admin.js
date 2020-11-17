import React, { Component } from 'react';
import Axios from 'axios';
import { Table } from 'evergreen-ui';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;

export default class Admin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			forms: []
		};
	}

	async componentDidMount() {
		try {
			let forms = await Axios.get('/fetchForms');
			if (forms.status === 200) {
				console.log(forms.data);
				this.setState({ forms: forms.data });
			}
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		let { forms } = this.state;
		return (
			<div className='admin-container'>
				<Table className='submissions-table'>
					<Table.Head>
						<Table.TextHeaderCell flexBasis={300} flexShrink={0} flexGrow={0}>
							Test ID
						</Table.TextHeaderCell>
						<Table.TextHeaderCell>Test Title</Table.TextHeaderCell>
					</Table.Head>
					<Table.Body>
						{forms.map((form, ind) => {
							return (
								<Table.Row
									key={ind}
									isSelectable
									onSelect={() => {
										window.location.href = `/admin/submissions/${form.id}`;
									}}
								>
									<Table.TextCell flexBasis={300} flexShrink={0} flexGrow={0}>
										{form.id}
									</Table.TextCell>
									<Table.TextCell>{form.title}</Table.TextCell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</div>
		);
	}
}
