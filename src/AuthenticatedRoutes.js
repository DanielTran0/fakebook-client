import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import Timeline from './pages/Timeline';

import { userDataProp, setUserDataProp } from './util/customPropTypes';

const AuthenticatedRoutes = ({ userData, setUserData }) => {
	const pageRoutes = [{ page: Timeline, path: '/' }];
	const pageRouteComponents = pageRoutes.map((pageRoute) => (
		<Route
			key={pageRoute.path}
			exact
			path={pageRoute.path}
			render={(routeProps) => (
				<pageRoute.page
					{...routeProps}
					userData={userData}
					serData={setUserData}
				/>
			)}
		/>
	));

	if (!userData.token) return <Redirect to='/login' />;

	return (
		<Navbar userData={userData} setUserData={setUserData}>
			<Switch>{pageRouteComponents}</Switch>
		</Navbar>
	);
};

AuthenticatedRoutes.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default AuthenticatedRoutes;
