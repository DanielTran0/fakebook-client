import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';

import useStateWithLocalStorage from './util/localStorageHook';

const App = () => {
	const [user, setUser] = useStateWithLocalStorage('fakebook-user');
	const [token, setToken] = useStateWithLocalStorage('fakebook-token');

	const userData = { user, token };
	const setUserData = { setUser, setToken };

	console.log(userData);

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
				</Switch>
			</Router>
		</div>
	);
};

export default App;
