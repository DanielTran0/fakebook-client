import React from 'react';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';

import { sessionRequests } from '../util/axiosRequests';
import { setUserDataProp } from '../util/customPropTypes';

const FacebookSignIn = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;

	const responseFacebook = async (response) => {
		if (!response.id) return null;

		console.log(response);
		setToken(response.accessToken);

		try {
			const userDataResponse = await sessionRequests.postFacebookLogin();
			return setUser(userDataResponse.data.user);
		} catch (error) {
			// TODO handle error
			return console.log(error.response);
		}
	};

	return (
		<FacebookLogin
			appId='205844311384443'
			fields='name, email, picture'
			callback={responseFacebook}
		/>
	);
};

FacebookSignIn.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default FacebookSignIn;
