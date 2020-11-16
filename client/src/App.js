import React from 'react';
import {
	CreateForm,
	Form,
	Login,
	Register,
	Header,
	Home,
	Admin,
	Submissions,
	Submission,
	Checking,
	NotFoundPage
} from './components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

function App() {
	return (
		<Router>
			<div className='App'>
				<Header />
				<Switch>
					{/* User Routes */}
					<Route exact path='/' component={Home} />
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/form/:id' component={Form} />
					<Route path='/submission/:id' component={Submission} />

					{/* Admin Routes */}
					<Route path='/admin/home' component={Admin} />
					<Route path='/admin/create' component={CreateForm} />
					<Route exact path='/admin/submissions/:id' component={Submissions} />
					<Route path='/admin/submissions/:id/:user' component={Checking} />

					{/* 404 */}
					<Route component={NotFoundPage} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
