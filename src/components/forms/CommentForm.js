import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { commentRequests } from '../../util/axiosRequests';
import { postProp } from '../../util/customPropTypes';

const CommentForm = ({ post, allPosts, setAllPosts }) => {
	const [formValues, setFormValues] = useState({ text: '' });
	const [formErrors, setFormErrors] = useState({});

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
			const commentResponse = await commentRequests.postNewComment(post._id, {
				...formValues,
			});
			const { comments } = commentResponse.data.post;
			const newAllPosts = [...allPosts];
			const updatedPostIndex = newAllPosts.findIndex(
				(singlePost) => singlePost._id === post._id
			);

			if (updatedPostIndex === -1) return null;

			newAllPosts[updatedPostIndex].comments = comments;

			setAllPosts(newAllPosts);
			return setFormValues({ text: '' });
		} catch (error) {
			return checkFormForErrors(error.response.data.errors);
		}
	};

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			<TextField
				variant='outlined'
				label='Write a comment...'
				name='text'
				fullWidth
				size='small'
				value={formValues.text}
				onChange={handleFormChange}
				error={Boolean(formErrors.text)}
				helperText={formErrors.text}
			/>
			<Typography variant='caption'>Press Enter to post.</Typography>
		</form>
	);
};

CommentForm.propTypes = {
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default CommentForm;
