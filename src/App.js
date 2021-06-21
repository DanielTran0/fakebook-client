import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthenticatedRoutes from './AuthenticatedRoutes';
import Login from './pages/Login';

import useStateWithLocalStorage from './util/localStorageHook';
import './styles/App.css';

/* TODO
CLIENT
	dark mode
	delete account 
	post creation no refresh
	handle errors and forms
	background image
	
SERVER
	decode text
	test user
	auto add my account



chat
*/

const App = () => {
	const [user, setUser] = useStateWithLocalStorage('fakebook-user');
	const [token, setToken] = useStateWithLocalStorage('fakebook-token');

	const userData = { user, token };
	const setUserData = { setUser, setToken };

	return (
		<div className='app'>
			<Router>
				<Switch>
					<Route
						exact
						path='/login'
						render={(routeProps) => (
							<Login
								{...routeProps}
								userData={userData}
								setUserData={setUserData}
							/>
						)}
					/>

					<AuthenticatedRoutes userData={userData} setUserData={setUserData} />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
