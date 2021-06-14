import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

import MenuOptions from './MenuOptions';

import formatDate from '../util/formatDate';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, postProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const PostCard = ({ userData, post, allPosts, setAllPosts }) => {
	const { user } = userData;
	const { text, postImage, date, comments, likes, user: postUser } = post;
	const classes = useStyles();

	return (
		<Card>
			<CardHeader
				// TODO linkable image and name
				avatar={<Avatar src={setUserImageSource(user)} />}
				title={`${postUser.firstName} ${postUser.lastName}`}
				subheader={formatDate(date)}
				action={
					<MenuOptions
						isPost
						post={post}
						allPosts={allPosts}
						setAllPosts={setAllPosts}
					/>
				}
			/>

			{text && (
				<CardContent>
					<Typography>{text}</Typography>
				</CardContent>
			)}

			{postImage && (
				<img
					src={`http://localhost:5000/static/images/posts/${postImage}`}
					alt='post'
				/>
			)}

			{likes.length || comments.length ? (
				<CardContent className={classes.postInfo}>
					<div>
						<Button
							className={classes.postButtons}
							startIcon={<ThumbUpAltOutlinedIcon />}
						>
							{likes.length}
						</Button>
					</div>
					<div>
						<Button
							className={classes.postButtons}
							startIcon={<ChatBubbleOutlineOutlinedIcon />}
						>
							{comments.length}
						</Button>
					</div>
				</CardContent>
			) : null}

			<Divider variant='middle' />
			<CardActions>
				<Button
					className={classes.postButtons}
					startIcon={<ThumbUpAltOutlinedIcon />}
				>
					Like
				</Button>
				<Button
					className={classes.postButtons}
					startIcon={<ChatBubbleOutlineOutlinedIcon />}
				>
					Comment
				</Button>
			</CardActions>
			<Divider variant='middle' />
		</Card>
	);
};

PostCard.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default PostCard;
