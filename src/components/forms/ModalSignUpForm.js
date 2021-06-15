import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

import { sessionRequests, userRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';
import useStyles from '../../util/useStylesHook';

const ModalSignUpForm = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formValues, setFormValues] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		passwordConfirmation: '',
	});
	const [formErrors, setFormErrors] = useState({});
	const classes = useStyles();

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const checkFormForErrors = (responseError) => {
		let errorMsgs = {};

		if (!formValues.firstName) errorMsgs = { firstName: 'Required Field' };
		if (!formValues.lastName)
			errorMsgs = { ...errorMsgs, lastName: 'Required Field' };
		if (!formValues.email)
			errorMsgs = { ...errorMsgs, email: 'Required Field' };
		if (!formValues.password)
			errorMsgs = { ...errorMsgs, password: 'Required Field' };
		if (!formValues.passwordConfirmation)
			errorMsgs = { ...errorMsgs, passwordConfirmation: 'Required Field' };

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
			await userRequests.postNewUser({ ...formValues });
			const { email, password } = formValues;
			const loginResponse = await sessionRequests.postNewSession({
				email,
				password,
			});
			const { user, token } = loginResponse.data;

			setUser(user);
			return setToken(token);
		} catch (error) {
			return checkFormForErrors(error.response.data.errors);
		}
	};

	const form = (
		<Container maxWidth='sm' className={classes.modal}>
			<Card>
				<CardHeader title='Sign Up' subheader='It’s quick and easy.' />

				<Divider />
				<CardContent>
					<form noValidate onSubmit={handleFormSubmit}>
						<TextField
							className={classes.bottomSpacing}
							variant='outlined'
							label='First name'
							name='firstName'
							required
							fullWidth
							value={formValues.firstName}
							onChange={handleFormChange}
							error={Boolean(formErrors.firstName)}
							helperText={formErrors.firstName}
						/>
						<TextField
							className={classes.bottomSpacing}
							variant='outlined'
							label='Last name'
							name='lastName'
							required
							fullWidth
							value={formValues.lastName}
							onChange={handleFormChange}
							error={Boolean(formErrors.lastName)}
							helperText={formErrors.lastName}
						/>
						<TextField
							className={classes.bottomSpacing}
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
							className={classes.bottomSpacing}
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
						<TextField
							className={classes.bottomSpacing}
							variant='outlined'
							label='Password confirmation'
							name='passwordConfirmation'
							type='password'
							required
							fullWidth
							value={formValues.passwordConfirmation}
							onChange={handleFormChange}
							error={Boolean(formErrors.passwordConfirmation)}
							helperText={formErrors.passwordConfirmation}
						/>

						<Button variant='contained' type='submit' color='primary' fullWidth>
							Sign Up
						</Button>
					</form>
				</CardContent>
			</Card>
		</Container>
	);

	return (
		<div className='modal-sign-up'>
			<Button variant='contained' onClick={handleModalOpen}>
				Create New Account
			</Button>

			<Modal open={isModalOpen} onClose={handleModalClose}>
				{form}
			</Modal>
		</div>
	);
};

ModalSignUpForm.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default ModalSignUpForm;
