import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import AuthenticatedRoutes from './AuthenticatedRoutes';
import Login from './pages/Login';

import useStateWithLocalStorage from './util/localStorageHook';

const theme = createMuiTheme({
	palette: { primary: { main: '#1877f2' }, background: { default: '#f0f2f5' } },
});

const App = () => {
	const [user, setUser] = useStateWithLocalStorage('user', {});
	const [token, setToken] = useStateWithLocalStorage('token', '');
	const userData = { user, token };
	const setUserData = { setUser, setToken };

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider
				maxSnack={2}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
			>
				<CssBaseline />
				<Router>
					<Switch>
						<Route
							exact
							path='/login'
							render={() => (
								<Login userData={userData} setUserData={setUserData} />
							)}
						/>
						<AuthenticatedRoutes
							userData={userData}
							setUserData={setUserData}
						/>
					</Switch>
				</Router>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default App;
