import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import MenuOptions from './MenuOptions';
import LikeButton from './LikeButton';

import formatDate from '../util/formatDate';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, postProp, commentProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const Comments = ({ userData, post, allPosts, setAllPosts, comment }) => {
	const { user, text, date, likes } = comment;
	const classes = useStyles();

	return (
		<Container className={classes.bottomSpacing} key={comment._id}>
			<div className={classes.flex}>
				<Link to={`/user/${user._id}`}>
					<Avatar src={setUserImageSource(user)} />
				</Link>

				<Container>
					<div className={classes.flex}>
						<div className={classes.commentText}>
							<Link to={`/user/${user._id}`}>
								<Typography
									className={classes.capitalize}
									variant='subtitle2'
								>{`${user.firstName} ${user.lastName}`}</Typography>
							</Link>
							<Typography>{text}</Typography>
						</div>

						<div className={classes.flex}>
							{user._id === userData.user._id && (
								<div className={classes.commentOptions}>
									<MenuOptions
										post={post}
										allPosts={allPosts}
										setAllPosts={setAllPosts}
										comment={comment}
									/>
								</div>
							)}

							{likes.length > 0 && (
								<div className={classes.flex}>
									<div className={classes.commentLikesNumber}>
										<ThumbUpIcon
											className={classes.sideSpacing}
											fontSize='small'
										/>
										<Typography variant='subtitle2'>{likes.length}</Typography>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className={classes.commentFooter}>
						<LikeButton
							userData={userData}
							post={post}
							allPosts={allPosts}
							setAllPosts={setAllPosts}
							comment={comment}
						/>

						<Typography variant='subtitle2'>
							{formatDate(date, true)}
						</Typography>
					</div>
				</Container>
			</div>
		</Container>
	);
};

Comments.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
	comment: PropTypes.shape(commentProp).isRequired,
};

export default Comments;
