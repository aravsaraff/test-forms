import React from 'react';
import { CreateForm } from './components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

function App() {
	return (
		<Router>
			<div className='App'>
				<Switch>
					<Route path='/create' component={CreateForm} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
