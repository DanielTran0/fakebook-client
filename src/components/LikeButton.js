import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

import { likeRequests } from '../util/axiosRequests';
import { userDataProp, postProp, commentProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const LikeButton = ({
	userData,
	post,
	allPosts,
	setAllPosts,
	isPost,
	comment,
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		if (isPost) {
			const didUserLikePost = post.likes.some(
				(like) => like.user._id === userData.user._id
			);

			if (didUserLikePost) return setIsLiked(true);

			return null;
		}

		const didUserLikeComment = comment.likes.some(
			(like) => like.user === userData.user._id
		);

		if (didUserLikeComment) return setIsLiked(true);

		return null;
	}, [userData, post, isPost, comment]);

	const handleLikeToggle = async () => {
		if (isPost) {
			try {
				const likeResponse = await likeRequests.putLikePost(post._id);
				const { likes } = likeResponse.data.post;
				const newAllPosts = [...allPosts];
				const updatedPostIndex = newAllPosts.findIndex(
					(singlePost) => singlePost._id === post._id
				);

				if (updatedPostIndex === -1) return null;

				newAllPosts[updatedPostIndex].likes = likes;

				setIsLiked(!isLiked);
				return setAllPosts(newAllPosts);
			} catch (error) {
				// TODO handle error
				return console.log(error);
			}
		}

		try {
			const likeResponse = await likeRequests.putLikeComment(
				post._id,
				comment._id
			);
			const { likes } = likeResponse.data.comment;
			const newAllPosts = [...allPosts];
			const updatedPostIndex = newAllPosts.findIndex(
				(singlePost) => singlePost._id === post._id
			);

			if (updatedPostIndex === -1) return null;

			const commentIndex = newAllPosts[updatedPostIndex].comments.findIndex(
				(singleComment) => singleComment._id === comment._id
			);

			if (commentIndex === -1) return null;

			newAllPosts[updatedPostIndex].comments[commentIndex].likes = likes;

			setIsLiked(!isLiked);
			return setAllPosts(newAllPosts);
		} catch (error) {
			// TODO handle error
			return console.log(error);
		}
	};

	return isPost ? (
		<Button
			className={classes.center}
			onClick={handleLikeToggle}
			startIcon={
				isLiked ? <ThumbUpIcon color='primary' /> : <ThumbUpAltOutlinedIcon />
			}
		>
			Like
		</Button>
	) : (
		<IconButton
			className={classes.sideSpacing}
			onClick={handleLikeToggle}
			color={isLiked ? 'primary' : 'default'}
			size='small'
		>
			<ThumbUpIcon fontSize='inherit' />
		</IconButton>
	);
};

LikeButton.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
	isPost: PropTypes.bool,
	comment: PropTypes.shape(commentProp),
};

LikeButton.defaultProps = {
	isPost: false,
	comment: null,
};

export default LikeButton;
