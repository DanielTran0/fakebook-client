import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';

import { tokenRequests, userRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: {
		marginBottom: 15,
	},
	modal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: `translate(-50%, -50%)`,
	},
	buttonText: {
		color: 'white',
	},
});

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
	const [isLoading, setIsLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
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
		setIsLoading(true);
		setFormErrors({});

		if (checkFormForErrors()) {
			setIsLoading(false);
			return null;
		}

		try {
			await userRequests.postNewUser({ ...formValues });
			const { email, password } = formValues;
			const loginResponse = await tokenRequests.postNewToken({
				email,
				password,
			});
			const { user, token } = loginResponse.data;

			setIsLoading(false);
			setUser(user);
			setToken(token);
			setIsModalOpen(false);
			return enqueueSnackbar('Welcome to fakebook', { variant: 'success' });
		} catch (error) {
			setIsLoading(false);

			if (error.response) return checkFormForErrors(error.response.data.errors);

			return enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	const form = (
		<Container maxWidth='sm' className={classes.modal}>
			<Card>
				<CardHeader
					title='Sign Up'
					subheader='It’s quick and easy.'
					action={
						<IconButton onClick={handleModalClose}>
							<CloseIcon />
						</IconButton>
					}
				/>

				<Divider />

				<CardContent>
					<form noValidate onSubmit={handleFormSubmit}>
						<TextField
							variant='outlined'
							label='First name'
							name='firstName'
							required
							fullWidth
							value={formValues.firstName}
							onChange={handleFormChange}
							error={Boolean(formErrors.firstName)}
							helperText={formErrors.firstName}
							className={classes.bottomSpacing}
						/>

						<TextField
							variant='outlined'
							label='Last name'
							name='lastName'
							required
							fullWidth
							value={formValues.lastName}
							onChange={handleFormChange}
							error={Boolean(formErrors.lastName)}
							helperText={formErrors.lastName}
							className={classes.bottomSpacing}
						/>

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

						<TextField
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
							className={classes.bottomSpacing}
						/>

						<Button
							variant='contained'
							type='submit'
							fullWidth
							disabled={isLoading}
							className={classes.button}
						>
							{isLoading ? (
								<CircularProgress color='secondary' />
							) : (
								<Typography>Sign Up</Typography>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</Container>
	);

	return (
		<div>
			<Button
				variant='contained'
				color='secondary'
				onClick={handleModalOpen}
				fullWidth
				className={classes.bottomSpacing}
			>
				<Typography className={classes.buttonText}>
					Create New Account
				</Typography>
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
