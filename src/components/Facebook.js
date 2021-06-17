import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { sessionRequests } from '../util/axiosRequests';
import { setUserDataProp } from '../util/customPropTypes';

const Facebook = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;

	const responseFacebook = async (response) => {
		if (!response.id) return null;

		setToken(response.accessToken);

		try {
			const userDataResponse = await sessionRequests.postFacebookLogin();
			return setUser(userDataResponse.data.user);
		} catch (error) {
			// TODO handle error
			return console.log(error);
		}
	};

	return (
		<FacebookLogin
			appId='205844311384443'
			fields='name, email, picture'
			callback={responseFacebook}
			render={(renderProps) => (
				<Button variant='contained' onClick={renderProps.onClick} fullWidth>
					Log in with FaceBook
				</Button>
			)}
		/>
	);
};

Facebook.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default Facebook;
