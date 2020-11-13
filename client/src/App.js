import React from 'react';
import { CreateForm, Form, Login, Register, Header, Home, Admin } from './components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

function App() {
	return (
		<Router>
			<div className='App'>
				<Header />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/create' component={CreateForm} />
					<Route path='/form/:id' component={Form} />
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/admin' component={Admin} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
