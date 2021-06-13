import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, TextField } from '@material-ui/core';

import { sessionRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';

const SignIn = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [formValues, setFormValues] = useState({ email: '', password: '' });
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleFormErrors = (responseError) => {
		let error = false;

		if (!formValues.email) {
			error = true;
			setEmailError('Required Field');
		}
		if (!formValues.password) {
			error = true;
			setPasswordError('Required Field');
		}
		if (responseError?.[0].param === 'email')
			setEmailError(responseError[0].msg);
		if (responseError?.[0].param === 'password')
			setPasswordError(responseError[0].msg);

		return error;
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		setEmailError('');
		setPasswordError('');

		if (handleFormErrors()) return null;

		try {
			const loginResponse = await sessionRequests.postNewSession({
				...formValues,
			});
			const { user, token } = loginResponse.data;
			console.log(loginResponse);

			setUser(user);
			return setToken(token);
		} catch (error) {
			return handleFormErrors(error.response.data.errors);
		}
	};

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			<TextField
				variant='outlined'
				label='Email'
				name='email'
				type='email'
				required
				fullWidth
				value={formValues.email}
				onChange={handleFormChange}
				error={Boolean(emailError)}
				helperText={emailError}
			/>
			<TextField
				variant='outlined'
				label='Password'
				name='password'
				type='password'
				required
				fullWidth
				value={formValues.password}
				onChange={handleFormChange}
				error={Boolean(passwordError)}
				helperText={passwordError}
			/>
			<Button variant='contained' type='submit' color='primary' fullWidth>
				Log In
			</Button>
		</form>
	);
};

SignIn.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default SignIn;
