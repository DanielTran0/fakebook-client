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

const PostForm = ({ post, handleModalClose, allPosts, setAllPosts }) => {
	const { _id, text } = post;
	const [formValues, setFormValues] = useState({ text, lastImage: 'keep' });
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
	};

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			{formErrors.general && (
				<Typography className={classes.formField} color='secondary'>
					{formErrors.general}
				</Typography>
			)}

			<TextField
				className={classes.formField}
				variant='outlined'
				label='Text'
				name='text'
				required
				fullWidth
				multiline
				rows={3}
				value={formValues.text}
				onChange={handleFormChange}
			/>

			<FormControl className={classes.formField}>
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
					<FormControlLabel value='' control={<Radio />} label='Use no image' />
					<FormControlLabel value='new' control={<Radio />} label='New image' />
				</RadioGroup>
			</FormControl>

			{formValues.lastImage === 'new' && (
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
					<Typography className={classes.formField} noWrap>
						{imageFile && imageFile.name}
					</Typography>
				</div>
			)}

			<Divider className={classes.formField} />
			<Button variant='contained' type='submit' onClick={handleModalClose}>
				Cancel
			</Button>
			<Button
				variant='contained'
				type='submit'
				startIcon={<SaveOutlinedIcon />}
			>
				Save
			</Button>
		</form>
	);
};

PostForm.propTypes = {
	post: PropTypes.shape(postProp).isRequired,
	handleModalClose: PropTypes.func.isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default PostForm;
