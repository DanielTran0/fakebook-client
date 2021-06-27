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
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

import { userRequests } from '../../util/axiosRequests';
import { userDataProp, setUserDataProp } from '../../util/customPropTypes';

const useStyles = makeStyles({
	modal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: `translate(-50%, -50%)`,
	},
	uploadButton: {
		color: '#fff',
	},
	bottomSpacing: {
		marginBottom: 10,
	},
});

const ModalBackgroundForm = ({ userData, setUserData }) => {
	const { _id, email, firstName, lastName } = userData.user;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [formErrors, setFormErrors] = useState({});
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setImageFile(null);
		setFormErrors({});
		setIsModalOpen(false);
	};

	const handleFormChange = (e) => {
		const { files } = e.target;
		setImageFile(files[0]);
	};

	const checkFormForErrors = (responseError) => {
		let errorMsgs = {};

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
			const updateResponse = await userRequests.putUpdateUser(_id, {
				email,
				firstName,
				lastName,
				userImage: imageFile,
				password: '',
				newPassword: '',
				newPasswordConfirmation: '',
				isBackground: true,
			});

			handleModalClose();
			setUserData.setUser({
				...userData.user,
				backgroundImage: updateResponse.data.backgroundImage,
			});
			return setImageFile(null);
		} catch (error) {
			if (error.response) return checkFormForErrors(error.response.data.errors);

			return enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	const form = (
		<Container maxWidth='sm' className={classes.modal}>
			<Card>
				<CardHeader
					title='Add a Background'
					subheader='Max image size of 5 MB'
					action={
						<IconButton onClick={handleModalClose}>
							<CloseIcon />
						</IconButton>
					}
				/>

				<Divider />

				{formErrors && (
					<Typography color='error' align='center'>
						{formErrors.general}
					</Typography>
				)}

				<CardContent>
					<form noValidate onSubmit={handleFormSubmit}>
						<div className={classes.bottomSpacing}>
							<Button
								variant='contained'
								component='label'
								color='secondary'
								startIcon={<CloudUploadIcon className={classes.uploadButton} />}
								fullWidth
								className={classes.bottomSpacing}
							>
								<Typography className={classes.uploadButton}>
									Upload Image
								</Typography>
								<input
									name='userImage'
									type='file'
									accept='image/png, image/gif, image/jpeg'
									onChange={handleFormChange}
									hidden
								/>
							</Button>
							<Typography noWrap align='center'>
								{imageFile && imageFile.name}
							</Typography>
						</div>

						<Button variant='contained' type='submit' color='primary' fullWidth>
							<Typography>Upload</Typography>
						</Button>
					</form>
				</CardContent>
			</Card>
		</Container>
	);

	return (
		<div>
			<IconButton color='primary' onClick={handleModalOpen}>
				<EditIcon fontSize={isSmallScreen ? 'default' : 'large'} />
			</IconButton>

			<Modal open={isModalOpen} onClose={handleModalClose}>
				{form}
			</Modal>
		</div>
	);
};

ModalBackgroundForm.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default ModalBackgroundForm;
