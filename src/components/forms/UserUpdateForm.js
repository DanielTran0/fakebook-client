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

import useStateWithLocalStorage from '../../util/localStorageHook';
import { userRequests } from '../../util/axiosRequests';
import { setUserDataProp } from '../../util/customPropTypes';
import useStyles from '../../util/useStylesHook';

const UserUpdateForm = ({ setUserData }) => {
	const [userDetails] = useStateWithLocalStorage('fakebook-user');
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [successMessage, setSuccessMessage] = useState(false);
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
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

	const handleShowPasswordChange = () => {
		setShowPasswordChange(true);
	};

	const handleFormChange = (e) => {
		const { name, value, files } = e.target;
		setSuccessMessage(false);

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
		setSuccessMessage(false);

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
			setImageFile(null);
			setSuccessMessage(true);
			return setUserData.setUser(updatedUser);
		} catch (error) {
			return checkFormForErrors(error.response.data.errors);
		}
	};

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			{formErrors.general && (
				<Typography className={classes.bottomSpacing} color='secondary'>
					{formErrors.general}
				</Typography>
			)}

			<div className={!isMobile ? classes.userCardSpacing : ''}>
				<TextField
					className={`${classes.bottomSpacing} `}
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
				/>
				<TextField
					className={`${classes.bottomSpacing} `}
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
				/>
			</div>

			{!userDetails.facebookId && (
				<TextField
					className={classes.bottomSpacing}
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
						fullWidth
					>
						Upload Image
						<input
							name='userImage'
							type='file'
							accept='image/png, image/gif, image/jpeg'
							onChange={handleFormChange}
							hidden
						/>
					</Button>
					<Typography className={classes.bottomSpacing} noWrap>
						{imageFile && imageFile.name}
					</Typography>
				</div>
			)}

			{!userDetails.facebookId && (
				<Button
					className={classes.bottomSpacing}
					variant='contained'
					onClick={handleShowPasswordChange}
				>
					Change Password
				</Button>
			)}

			{showPasswordChange && !userDetails.facebookId && (
				<div>
					<Typography className={classes.bottomSpacing}>
						Min Length 8, 1 Capital Letter, 1 Number
					</Typography>

					<TextField
						className={classes.bottomSpacing}
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
					/>

					<TextField
						className={classes.bottomSpacing}
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
					/>
					<TextField
						className={classes.bottomSpacing}
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
					/>
				</div>
			)}

			<Button
				className={classes.bottomSpacing}
				variant='contained'
				type='submit'
				fullWidth
			>
				Save Changes
			</Button>

			{successMessage && (
				<Typography align='center'>
					Your account has been successfully updated
				</Typography>
			)}
		</form>
	);
};

UserUpdateForm.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default UserUpdateForm;
