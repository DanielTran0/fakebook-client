import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import useStateWithLocalStorage from '../../util/localStorageHook';
import { userRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: { marginBottom: 15 },
	flex: { display: 'flex' },
	uploadText: {
		color: '#fff',
	},
});

const UserUpdateForm = ({ setUserData }) => {
	const [userDetails] = useStateWithLocalStorage('user', {});
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [formValues, setFormValues] = useState({
		firstName: userDetails.firstName,
		lastName: userDetails.lastName,
		email: userDetails.email,
		password: '',
		newPassword: '',
		newPasswordConfirmation: '',
		lastImage: 'keep',
	});
	const [imageFile, setImageFile] = useState(null);
	const [formErrors, setFormErrors] = useState({});
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const handleShowPasswordChange = () => {
		setShowPasswordChange(true);
	};

	const handleFormChange = (e) => {
		const { name, value, files } = e.target;

		if (name === 'userImage') return setImageFile(files[0]);

		return setFormValues({ ...formValues, [name]: value });
	};

	const checkFormForErrors = (responseError) => {
		const {
			firstName,
			lastName,
			email,
			lastImage,
			password,
			newPassword,
			newPasswordConfirmation,
		} = formValues;
		let errorMsgs = {};

		if (
			firstName === userDetails.firstName &&
			lastName === userDetails.lastName &&
			email === userDetails.email &&
			lastImage !== '' &&
			!imageFile &&
			!password &&
			!newPassword &&
			!newPasswordConfirmation
		) {
			errorMsgs = { general: 'Fields are unchanged' };
		}

		if (responseError) {
			responseError.forEach((error) => {
				errorMsgs = {
					...errorMsgs,
					[error.param]: `${
						errorMsgs[error.param] ? errorMsgs[error.param] : ''
					} ${error.msg || error.message}`,
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
			const userUpdateResponse = await userRequests.putUpdateUser(
				userDetails._id,
				{
					...formValues,
					userImage: imageFile,
					isBackground: false,
				}
			);
			const { user: updatedUser } = userUpdateResponse.data;

			setShowPasswordChange(false);
			setFormValues({
				...formValues,
				password: '',
				newPassword: '',
				newPasswordConfirmation: '',
			});
			setImageFile(null);
			setUserData.setUser(updatedUser);
			return enqueueSnackbar('Successfully updated account', {
				variant: 'success',
			});
		} catch (error) {
			if (error.response) return checkFormForErrors(error.response.data.errors);

			return enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			{formErrors.general && (
				<Typography
					color='error'
					align='center'
					className={classes.bottomSpacing}
				>
					{formErrors.general}
				</Typography>
			)}

			<div className={isSmallScreen ? '' : classes.flex}>
				<TextField
					variant='outlined'
					label='First name'
					name='firstName'
					size='small'
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
					size='small'
					required
					fullWidth
					value={formValues.lastName}
					onChange={handleFormChange}
					error={Boolean(formErrors.lastName)}
					helperText={formErrors.lastName}
					className={classes.bottomSpacing}
				/>
			</div>

			{!userDetails.facebookId && (
				<TextField
					variant='outlined'
					label='Email'
					name='email'
					type='email'
					size='small'
					required
					fullWidth
					value={formValues.email}
					onChange={handleFormChange}
					error={Boolean(formErrors.email)}
					helperText={formErrors.email}
					className={classes.bottomSpacing}
				/>
			)}

			<FormControl className={`${classes.bottomSpacing} ${classes.flex}`}>
				<FormLabel>Profile Image</FormLabel>
				<RadioGroup
					name='lastImage'
					value={formValues.lastImage}
					onChange={handleFormChange}
				>
					<FormControlLabel
						value='keep'
						control={<Radio />}
						label='Use previous image'
					/>
					<FormControlLabel value='' control={<Radio />} label='Use no image' />
					<FormControlLabel value='new' control={<Radio />} label='New image' />
				</RadioGroup>
			</FormControl>

			{formValues.lastImage === 'new' && (
				<div>
					<Button
						className={classes.bottomSpacing}
						variant='contained'
						component='label'
						color='secondary'
						startIcon={<CloudUploadIcon className={classes.uploadText} />}
						fullWidth
					>
						<Typography className={classes.uploadText}>Upload Image</Typography>

						<input
							name='userImage'
							type='file'
							accept='image/png, image/gif, image/jpeg'
							onChange={handleFormChange}
							hidden
						/>
					</Button>

					<Typography noWrap align='center' className={classes.bottomSpacing}>
						{imageFile && imageFile.name}
					</Typography>
				</div>
			)}

			{!userDetails.facebookId && !showPasswordChange && (
				<Button
					variant='contained'
					onClick={handleShowPasswordChange}
					className={classes.bottomSpacing}
				>
					Change Password
				</Button>
			)}

			{showPasswordChange && !userDetails.facebookId && (
				<div>
					<Typography className={classes.bottomSpacing}>
						Min Length 5, 1 Capital Letter, 1 Number
					</Typography>

					<TextField
						variant='outlined'
						label='Old Password'
						name='password'
						type='password'
						size='small'
						fullWidth
						value={formValues.password}
						onChange={handleFormChange}
						error={Boolean(formErrors.password)}
						helperText={formErrors.password}
						className={classes.bottomSpacing}
					/>

					<TextField
						variant='outlined'
						label='New Password'
						name='newPassword'
						type='password'
						size='small'
						fullWidth
						value={formValues.newPassword}
						onChange={handleFormChange}
						error={Boolean(formErrors.newPassword)}
						helperText={formErrors.newPassword}
						className={classes.bottomSpacing}
					/>
					<TextField
						variant='outlined'
						label='New Password Confirmation'
						name='newPasswordConfirmation'
						type='password'
						size='small'
						fullWidth
						value={formValues.newPasswordConfirmation}
						onChange={handleFormChange}
						error={Boolean(formErrors.newPasswordConfirmation)}
						helperText={formErrors.newPasswordConfirmation}
						className={classes.bottomSpacing}
					/>
				</div>
			)}

			<Button
				className={classes.bottomSpacing}
				variant='contained'
				type='submit'
				color='primary'
				fullWidth
			>
				Save Changes
			</Button>
		</form>
	);
};

UserUpdateForm.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default UserUpdateForm;
