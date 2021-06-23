import React, { useState } from 'react';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

import { postRequests } from '../../util/axiosRequests';
import { postProp } from '../../util/customPropTypes';

const useStyles = makeStyles({
	sideSpacing: {
		marginRight: 10,
	},
	bottomSpacing: {
		marginBottom: 15,
	},
	buttonText: {
		color: 'white',
	},
});

const PostForm = ({
	handleModalClose,
	post,
	allPosts,
	setAllPosts,
	isEdit,
	handleActiveTab,
}) => {
	const { _id, text } = post || {};
	const [isNewPostSent, setIsNewPostSent] = useState(false);
	const [formValues, setFormValues] = useState({
		text: text || '',
		lastImage: 'keep',
	});
	const [imageFile, setImageFile] = useState(null);
	const [formErrors, setFormErrors] = useState({});
	const history = useHistory();
	const location = useLocation();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const handleFormChange = (e) => {
		const { name, value, files } = e.target;

		if (name !== 'text') setImageFile(null);
		if (name === 'postImage') return setImageFile(files[0]);

		return setFormValues({ ...formValues, [name]: value });
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

		if (isEdit) {
			try {
				const editResponse = await postRequests.putEditPost({
					postId: _id,
					text: formValues.text,
					postImage: imageFile,
					lastImage: formValues.lastImage,
				});
				const { post: updatedPost } = editResponse.data;
				const newAllPosts = [...allPosts];
				const updatedPostIndex = newAllPosts.findIndex(
					(singlePost) => singlePost._id === _id
				);

				if (updatedPostIndex === -1) return null;

				newAllPosts[updatedPostIndex] = updatedPost;

				setAllPosts(newAllPosts);
				return handleModalClose();
			} catch (error) {
				if (error.response)
					return checkFormForErrors(error.response.data.errors);

				return enqueueSnackbar(error.message, { variant: 'error' });
			}
		}

		try {
			await postRequests.postNewPost({
				text: formValues.text,
				postImage: imageFile,
			});

			if (location.pathname !== '/') {
				handleActiveTab('home');
				setIsNewPostSent(true);
				return handleModalClose();
			}

			history.push('/login');
			return handleModalClose();
		} catch (error) {
			if (error.response) return checkFormForErrors(error.response.data.errors);

			return enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	if (isNewPostSent) return <Redirect to='/' />;

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			{formErrors.general && (
				<Typography className={classes.bottomSpacing} color='error'>
					{formErrors.general}
				</Typography>
			)}

			<TextField
				variant='outlined'
				label='Text'
				name='text'
				fullWidth
				value={formValues.text}
				onChange={handleFormChange}
				className={classes.bottomSpacing}
			/>

			{isEdit && (
				<FormControl className={classes.bottomSpacing}>
					<FormLabel>Post Image</FormLabel>
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
						<FormControlLabel
							value=''
							control={<Radio />}
							label='Use no image'
						/>
						<FormControlLabel
							value='new'
							control={<Radio />}
							label='New image'
						/>
					</RadioGroup>
				</FormControl>
			)}

			{(!isEdit || formValues.lastImage === 'new') && (
				<div>
					<Button
						variant='contained'
						component='label'
						color='secondary'
						startIcon={<CloudUploadIcon className={classes.buttonText} />}
						fullWidth
						className={classes.bottomSpacing}
					>
						<Typography className={classes.buttonText}>Upload Image</Typography>

						<input
							name='postImage'
							type='file'
							accept='image/png, image/gif, image/jpeg'
							onChange={handleFormChange}
							hidden
						/>
					</Button>

					{imageFile && (
						<Typography noWrap align='center' className={classes.bottomSpacing}>
							{imageFile.name}
						</Typography>
					)}
				</div>
			)}

			<Divider className={classes.bottomSpacing} />

			<Button
				variant='contained'
				type='submit'
				color='primary'
				startIcon={isEdit && <SaveOutlinedIcon />}
				fullWidth
			>
				<Typography>{isEdit ? 'Save' : 'Post'}</Typography>
			</Button>
		</form>
	);
};

PostForm.propTypes = {
	handleModalClose: PropTypes.func.isRequired,
	post: PropTypes.shape(postProp),
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)),
	setAllPosts: PropTypes.func,
	isEdit: PropTypes.bool,
	handleActiveTab: PropTypes.func,
};

PostForm.defaultProps = {
	post: null,
	allPosts: null,
	setAllPosts: null,
	isEdit: false,
	handleActiveTab: null,
};

export default PostForm;
