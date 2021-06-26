import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { tokenRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: {
		marginBottom: 15,
	},
	unbold: {
		fontWeight: 'normal',
	},
});

const SignIn = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [formValues, setFormValues] = useState({ email: '', password: '' });
	const [formErrors, setFormErrors] = useState({});
	const { enqueueSnackbar } = useSnackbar();
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
		if (responseError) {
			responseError.forEach((error) => {
				errorMsgs = {
					...errorMsgs,
					[error.param]: `${
						errorMsgs[error.param] ? errorMsgs[error.param] : ''
					} ${error.msg}`,
				};
			});
		}
		if (Object.keys(errorMsgs).length === 0) return false;

		setFormErrors(errorMsgs);
		return true;
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setFormErrors({});

		if (checkFormForErrors()) return null;

		try {
			const loginResponse = await tokenRequests.postNewToken({
				...formValues,
			});
			const { user, token } = loginResponse.data;

			setUser(user);
			return setToken(token);
		} catch (error) {
			if (error.response) return checkFormForErrors(error.response.data.errors);

			return enqueueSnackbar(error.message, { variant: 'error' });
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
				error={Boolean(formErrors.email)}
				helperText={formErrors.email}
				className={classes.bottomSpacing}
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
				error={Boolean(formErrors.password)}
				helperText={formErrors.password}
				className={classes.bottomSpacing}
			/>

			<Button
				variant='contained'
				type='submit'
				color='primary'
				fullWidth
				className={classes.bottomSpacing}
			>
				<Typography variant='h6' className={classes.unbold}>
					Log In
				</Typography>
			</Button>
		</form>
	);
};

SignIn.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default SignIn;
