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

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		try {
			const commentResponse = await commentRequests.postNewComment(post._id, {
				...formValues,
			});
			const { comments } = commentResponse.data.post;

			// setCommentsArray(newComments);
			// setCommentFormValues({ text: '' });
			// setCommentFormErrors([]);
		} catch (error) {
			// setCommentFormErrors(error.response.data.errors);
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
