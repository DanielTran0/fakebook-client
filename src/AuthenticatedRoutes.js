import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import Timeline from './pages/Timeline';

import { postRequests } from './util/axiosRequests';
import { userDataProp, setUserDataProp } from './util/customPropTypes';

const AuthenticatedRoutes = ({ userData, setUserData }) => {
	const [allPosts, setAllPosts] = useState([]);

	const fetchData = async () => {
		try {
			const postsResponse = await postRequests.getUserAndFriendPosts();
			setAllPosts(postsResponse.data.posts);
		} catch (error) {
			// TODO handle error
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

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
					allPosts={allPosts}
					setAllPosts={setAllPosts}
				/>
			)}
		/>
	));

	if (!userData.token) return <Redirect to='/login' />;

	return (
		<Navbar
			userData={userData}
			setUserData={setUserData}
			allPosts={allPosts}
			setAllPosts={setAllPosts}
		>
			<Switch>{pageRouteComponents}</Switch>
		</Navbar>
	);
};

AuthenticatedRoutes.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default AuthenticatedRoutes;
