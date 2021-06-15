import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { commentRequests } from '../../util/axiosRequests';
import useStyles from '../../util/useStylesHook';
import { postProp, commentProp } from '../../util/customPropTypes';

const CommentForm = ({ post, allPosts, setAllPosts, comment, isEdit }) => {
	const [formValues, setFormValues] = useState({ text: '' });
	const [formErrors, setFormErrors] = useState({});
	const classes = useStyles();

	useEffect(() => {
		if (isEdit) setFormValues({ text: comment.text });
	}, [isEdit, comment]);

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

		if (isEdit) {
			try {
				const editResponse = await commentRequests.putEditComment(
					post._id,
					comment._id,
					{ ...formValues }
				);
				const { comments } = editResponse.data.post;
				const newAllPosts = [...allPosts];
				const updatedPostIndex = newAllPosts.findIndex(
					(singlePost) => singlePost._id === post._id
				);

				if (updatedPostIndex === -1) return null;

				newAllPosts[updatedPostIndex].comments = comments;

				return setAllPosts(newAllPosts);
			} catch (error) {
				return checkFormForErrors(error.response.data.errors);
			}
		}

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
			{formErrors.general && (
				<Typography className={classes.bottomSpacing} color='secondary'>
					{formErrors.general}
				</Typography>
			)}

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
	comment: PropTypes.shape(commentProp),
	isEdit: PropTypes.bool,
};

CommentForm.defaultProps = {
	comment: null,
	isEdit: false,
};

export default CommentForm;
