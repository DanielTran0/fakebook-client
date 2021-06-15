import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import MenuOptions from './MenuOptions';

import { commentRequests } from '../util/axiosRequests';
import formatDate from '../util/formatDate';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, postProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const Comments = ({ userData, post, allPosts, setAllPosts }) => {
	const classes = useStyles();

	const commentComponents = post.comments.map((comment) => {
		const { user, text, date } = comment;

		return (
			<Container className={classes.bottomSpacing} key={comment._id}>
				<div className={classes.flex}>
					<Avatar src={setUserImageSource(user)} />

					<Container>
						<div className={classes.flex}>
							<div className={classes.commentText}>
								<Typography variant='subtitle2'>{`${user.firstName} ${user.lastName}`}</Typography>
								<Typography>{text}</Typography>
							</div>

							{user._id === userData.user._id && (
								<div className={classes.commentOptions}>
									<MenuOptions
										isPost={false}
										post={post}
										allPosts={allPosts}
										setAllPosts={setAllPosts}
									/>
								</div>
							)}
						</div>

						<div className={classes.commentFooter}>
							<Button
								className={classes.commentLikeButton}
								size='small'
								disableRipple
							>
								Like
							</Button>
							<Typography variant='subtitle2'>
								{formatDate(date, true)}
							</Typography>
						</div>
					</Container>
				</div>
			</Container>
		);
	});

	return <div className='comments'>{commentComponents}</div>;
};

Comments.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default Comments;
