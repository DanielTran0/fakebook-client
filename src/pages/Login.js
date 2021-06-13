import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Container } from '@material-ui/core';
import SignInForm from '../components/forms/SignInForm';

import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const Login = ({ userData, setUserData }) => {
	const { token } = userData;

	if (token) return <Redirect to='/' />;

	return (
		<div className='login'>
			<Container maxWidth='xs'>
				<SignInForm setUserData={setUserData} />
			</Container>
		</div>
	);
};

Login.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default Login;
