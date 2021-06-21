import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import { userRequests } from '../../util/axiosRequests';
import { userDataProp, setUserDataProp } from '../../util/customPropTypes';

const ModalBackgroundForm = ({ userData, setUserData }) => {
	const { _id, email, firstName, lastName } = userData.user;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [formErrors, setFormErrors] = useState({});

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
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
			// TODO handle error
			console.log(error.response);
			return checkFormForErrors(error.response.data.errors);
		}
	};

	const form = (
		<Container maxWidth='sm'>
			<Card>
				<CardHeader
					title='Add a background image'
					subheader='Max image size of 1.5 MB'
				/>

				<Divider />

				{formErrors && (
					<Typography color='secondary'>{formErrors.general}</Typography>
				)}

				<CardContent>
					<form noValidate onSubmit={handleFormSubmit}>
						<div>
							<Button variant='contained' component='label' fullWidth>
								Upload Image
								<input
									name='postImage'
									type='file'
									accept='image/png, image/gif, image/jpeg'
									onChange={handleFormChange}
									hidden
								/>
							</Button>
							<Typography noWrap>{imageFile && imageFile.name}</Typography>
						</div>

						<Button variant='contained' type='submit' color='primary' fullWidth>
							Upload
						</Button>
					</form>
				</CardContent>
			</Card>
		</Container>
	);

	return (
		<div className='modal-background'>
			<Button variant='contained' onClick={handleModalOpen}>
				Add Background
			</Button>

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
