import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { sessionRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';
import useStyles from '../../util/useStylesHook';

const SignIn = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [formValues, setFormValues] = useState({ email: '', password: '' });
	const [formErrors, setFormErrors] = useState({});
	const classes = useStyles();

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const checkFormForErrors = (responseError) => {
		let errorMsgs = {};

		if (!formValues.email) errorMsgs = { email: 'Required field' };
		if (!formValues.password)
			errorMsgs = { ...errorMsgs, password: 'Required field' };
		if (responseError?.[0].param === 'email')
			errorMsgs = { ...errorMsgs, email: responseError[0].msg };
		if (responseError?.[0].param === 'password')
			errorMsgs = { ...errorMsgs, password: responseError[0].msg };
		if (Object.keys(errorMsgs).length === 0) return false;

		setFormErrors(errorMsgs);
		return true;
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setFormErrors({});

		if (checkFormForErrors()) return null;

		try {
			const loginResponse = await sessionRequests.postNewSession({
				...formValues,
			});
			const { user, token } = loginResponse.data;

			setUser(user);
			return setToken(token);
		} catch (error) {
			return checkFormForErrors(error.response.data.errors);
		}
	};

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			<TextField
				className={classes.formField}
				variant='outlined'
				label='Email'
				name='email'
				type='email'
				required
				fullWidth
				value={formValues.email}
				onChange={handleFormChange}
				error={Boolean(formErrors.email)}
				helperText={formErrors.email}
			/>
			<TextField
				className={classes.formField}
				variant='outlined'
				label='Password'
				name='password'
				type='password'
				required
				fullWidth
				value={formValues.password}
				onChange={handleFormChange}
				error={Boolean(formErrors.password)}
				helperText={formErrors.password}
			/>
			<Button
				className={classes.formField}
				variant='contained'
				type='submit'
				color='primary'
				fullWidth
			>
				Log In
			</Button>
		</form>
	);
};

SignIn.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default SignIn;
