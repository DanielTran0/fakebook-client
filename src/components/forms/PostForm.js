import React, { useState } from 'react';
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

import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

import { postRequests } from '../../util/axiosRequests';
import useStyles from '../../util/useStylesHook';
import { postProp } from '../../util/customPropTypes';

const PostForm = ({
	post,
	handleModalClose,
	allPosts,
	setAllPosts,
	isEdit,
}) => {
	const { _id, text } = post || {};
	const [formValues, setFormValues] = useState({
		text: text || '',
		lastImage: 'keep',
	});
	const [imageFile, setImageFile] = useState(null);
	const [formErrors, setFormErrors] = useState({});
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
				return checkFormForErrors(error.response.data.errors);
			}
		}

		try {
			await postRequests.postNewPost({
				text: formValues.text,
				postImage: imageFile,
			});

			return handleModalClose();
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

			<TextField
				className={classes.bottomSpacing}
				variant='outlined'
				label='Text'
				name='text'
				fullWidth
				value={formValues.text}
				onChange={handleFormChange}
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
					<Typography className={classes.bottomSpacing} noWrap>
						{imageFile && imageFile.name}
					</Typography>
				</div>
			)}

			<Divider className={classes.bottomSpacing} />

			<Button
				variant='contained'
				type='submit'
				startIcon={isEdit && <SaveOutlinedIcon />}
				fullWidth
			>
				{isEdit ? 'Save' : 'Post'}
			</Button>
		</form>
	);
};

PostForm.propTypes = {
	post: PropTypes.shape(postProp),
	handleModalClose: PropTypes.func.isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)),
	setAllPosts: PropTypes.func,
	isEdit: PropTypes.bool,
};

PostForm.defaultProps = {
	post: null,
	allPosts: null,
	setAllPosts: null,
	isEdit: false,
};

export default PostForm;
