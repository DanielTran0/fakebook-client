import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

import { likeRequests } from '../util/axiosRequests';
import { userDataProp, postProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const LikeButton = ({ userData, post, allPosts, setAllPosts }) => {
	const [isPostLiked, setIsPostLiked] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		const didUserLikePost = post.likes.some(
			(like) => like.user._id === userData.user._id
		);

		if (didUserLikePost) setIsPostLiked(true);
	}, [userData, post]);

	const handleLikeToggle = async () => {
		try {
			const likeResponse = await likeRequests.putLikePost(post._id);
			const { likes } = likeResponse.data.post;
			const newAllPosts = [...allPosts];
			const updatedPostIndex = newAllPosts.findIndex(
				(singlePost) => singlePost._id === post._id
			);

			if (updatedPostIndex === -1) return null;

			newAllPosts[updatedPostIndex].likes = likes;

			setIsPostLiked(!isPostLiked);
			return setAllPosts(newAllPosts);
		} catch (error) {
			return console.log(error.response);
		}
	};

	return (
		<Button
			className={classes.postButtons}
			onClick={handleLikeToggle}
			startIcon={
				isPostLiked ? (
					<ThumbUpIcon color='primary' />
				) : (
					<ThumbUpAltOutlinedIcon />
				)
			}
		>
			Like
		</Button>
	);
};

LikeButton.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default LikeButton;
