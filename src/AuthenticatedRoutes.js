import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AllUsers from './pages/AllUsers';
import Chatroom from './pages/Chatroom';
import Friends from './pages/Friends';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';
import UserPage from './pages/UserPage';

import {
	userDataProp,
	setUserDataProp,
	colourModeObjectProp,
} from './util/customPropTypes';

const AuthenticatedRoutes = ({ userData, setUserData, colourModeObject }) => {
	const [activeTab, setActiveTab] = useState('');
	const pageRoutes = [
		{ page: Timeline, path: '/' },
		{ page: AllUsers, path: '/users' },
		{ page: Friends, path: '/friends' },
		{ page: Settings, path: '/settings' },
		{ page: Chatroom, path: '/chat' },
	];

	const pageRouteComponents = pageRoutes.map((pageRoute) => (
		<Route
			exact
			path={pageRoute.path}
			render={(routeProps) => (
				<pageRoute.page
					{...routeProps}
					userData={userData}
					setUserData={setUserData}
					setActiveTab={setActiveTab}
					colourModeObject={colourModeObject}
				/>
			)}
			key={pageRoute.path}
		/>
	));

	if (!userData.token) return <Redirect to='/login' />;

	return (
		<Navbar
			userData={userData}
			setUserData={setUserData}
			colourModeObject={colourModeObject}
			activeTab={activeTab}
			setActiveTab={setActiveTab}
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
							setActiveTab={setActiveTab}
							colourModeObject={colourModeObject}
						/>
					)}
				/>

				<Route
					render={(routeProps) => (
						<NotFound {...routeProps} setActiveTab={setActiveTab} />
					)}
				/>
			</Switch>
		</Navbar>
	);
};

AuthenticatedRoutes.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	colourModeObject: PropTypes.shape(colourModeObjectProp).isRequired,
};

export default AuthenticatedRoutes;
