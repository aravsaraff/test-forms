import React from 'react';
import { CreateForm, Form } from './components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

function App() {
	return (
		<Router>
			<div className='App'>
				<Switch>
					<Route path='/create' component={CreateForm} />
					<Route path='/form/:id' component={Form} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
