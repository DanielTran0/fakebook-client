import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import AllUsers from './pages/AllUsers';
import Chatroom from './pages/Chatroom';
import Friends from './pages/Friends';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';
import UserPage from './pages/UserPage';

import useStateWithLocalStorage from './util/localStorageHook';
import { userDataProp, setUserDataProp } from './util/customPropTypes';

const AuthenticatedRoutes = ({ userData, setUserData }) => {
	const [isDarkMode, setIsDarkMode] = useStateWithLocalStorage(
		'dark-mode',
		'false'
	);

	const theme = createMuiTheme({
		palette: {
			type: isDarkMode === 'true' ? 'dark' : 'light',
		},
	});

	const pageRoutes = [
		{ page: Timeline, path: '/' },
		{ page: AllUsers, path: '/users' },
		{ page: Friends, path: '/friends' },
		{ page: Settings, path: '/settings' },
		{ page: Chatroom, path: '/chat' },
	];

	const pageRouteComponents = pageRoutes.map((pageRoute) => (
		<Route
			key={pageRoute.path}
			exact
			path={pageRoute.path}
			render={(routeProps) => (
				<pageRoute.page
					{...routeProps}
					userData={userData}
					setUserData={setUserData}
				/>
			)}
		/>
	));

	if (!userData.token) return <Redirect to='/login' />;

	return (
		<ThemeProvider theme={theme}>
			<Navbar
				userData={userData}
				setUserData={setUserData}
				darkMode={{ isDarkMode, setIsDarkMode }}
			>
				<Switch>
					{pageRouteComponents}
					<Route
						path='/user/:userId'
						render={(routeProps) => (
							<UserPage
								{...routeProps}
								userData={userData}
								setUserData={setUserData}
							/>
						)}
					/>
					<Route component={NotFound} />
				</Switch>
			</Navbar>
		</ThemeProvider>
	);
};

AuthenticatedRoutes.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default AuthenticatedRoutes;
