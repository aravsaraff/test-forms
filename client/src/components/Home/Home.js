import React, { Component } from 'react';
import Axios from 'axios';
import { Table } from 'evergreen-ui';
import { Submission } from '../../components';
import './Home.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			submittedForms: []
		};
	}

	async componentDidMount() {
		try {
			let forms = await Axios.get('/submittedForms');
			if (forms.status === 200) {
				console.log(forms.data);
				this.setState({ submittedForms: forms.data });
			}
		} catch (err) {
			console.log(err);
		}
	}

	showSubmission = (form) => {
		try {
			console.log(form);
			<Submission form={form} />;
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		let { submittedForms } = this.state;
		return (
			<div className='home-container'>
				<Table className='submissions-table'>
					<Table.Head>
						<Table.TextHeaderCell flexBasis={300} flexShrink={0} flexGrow={0}>
							Form
						</Table.TextHeaderCell>
						<Table.TextHeaderCell>Score</Table.TextHeaderCell>
						<Table.TextHeaderCell>Checked?</Table.TextHeaderCell>
					</Table.Head>
					<Table.Body>
						{submittedForms.map((form, ind) => {
							return (
								<Table.Row
									key={ind}
									isSelectable
									onSelect={() => {
										window.location.href = `/submission/${form.formId}`;
									}}
								>
									<Table.TextCell flexBasis={300} flexShrink={0} flexGrow={0}>
										{form.formId}
									</Table.TextCell>
									<Table.TextCell isNumber>{form.score}</Table.TextCell>
									<Table.TextCell>{form.checked ? 'Yes' : 'No'}</Table.TextCell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</div>
		);
	}
}
