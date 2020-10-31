import React from 'react';
import { CreateForm, ShowForm } from './components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

function App() {
	return (
		<Router>
			<div className='App'>
				<Switch>
					<Route path='/create' component={CreateForm} />
					<Route path='/form/:id' component={ShowForm} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
