import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

import MenuOptions from './MenuOptions';
import Comment from './Comment';
import CommentForm from './forms/CommentForm';
import LikeButton from './LikeButton';

import formatDate from '../util/formatDate';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, postProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const PostCard = ({ userData, post, allPosts, setAllPosts }) => {
	const { user } = userData;
	const { text, postImage, date, comments, likes, user: postUser } = post;
	const [isCommentsOpen, setIsCommentsOpen] = useState(true);
	const [isAddCommentOpen, setIsAddCommentsOpen] = useState(true);
	const [showMultipleComments, setShowMultipleComments] = useState(false);
	const [isToolBarOpen, setIsToolBarOpen] = useState(false);
	const classes = useStyles();

	const handleCommentOpenToggle = () => {
		setIsCommentsOpen(!isCommentsOpen);
	};

	const handleAddCommentOpenToggle = () => {
		setIsAddCommentsOpen(!isAddCommentOpen);
	};

	const handleShowMoreCommentsToggle = () => {
		setShowMultipleComments(!showMultipleComments);
	};

	const handleLikeToolBarOpen = () => {
		setIsToolBarOpen(true);
	};

	const handleLikeToolBarClose = () => {
		setIsToolBarOpen(false);
	};

	const commentComponents = post.comments.map((comment) => (
		<Comment
			userData={userData}
			post={post}
			allPosts={allPosts}
			setAllPosts={setAllPosts}
			comment={comment}
			key={comment._id}
		/>
	));

	const postLikedNames = (
		<List disablePadding>
			{post.likes.map((like) => (
				<ListItem className={classes.noMargin} disableGutters key={like._id}>
					<ListItemText
						className={classes.noMargin}
						primary={`${like.user.firstName} ${like.user.lastName}`}
						primaryTypographyProps={{ variant: 'subtitle2' }}
					/>
				</ListItem>
			))}
		</List>
	);

	return (
		<Card className={classes.postSpacing}>
			<CardHeader
				// TODO linkable image and name
				avatar={<Avatar src={setUserImageSource(user)} />}
				title={`${postUser.firstName} ${postUser.lastName}`}
				subheader={formatDate(date)}
				action={
					post.user._id === userData.user._id && (
						<MenuOptions
							isPost
							post={post}
							allPosts={allPosts}
							setAllPosts={setAllPosts}
						/>
					)
				}
			/>

			{text && (
				<Container>
					<Typography>{text}</Typography>
				</Container>
			)}

			{postImage && (
				<img
					src={`http://localhost:5000/static/images/posts/${postImage}`}
					alt='post'
				/>
			)}

			{likes.length || comments.length ? (
				<div className={classes.buttonSpaceEnd}>
					<Tooltip title={postLikedNames} open={isToolBarOpen} arrow>
						<Button
							startIcon={<ThumbUpAltOutlinedIcon />}
							onClick={handleLikeToolBarOpen}
							onMouseEnter={handleLikeToolBarOpen}
							onMouseLeave={handleLikeToolBarClose}
						>
							{likes.length}
						</Button>
					</Tooltip>

					<Button
						startIcon={<ChatBubbleOutlineOutlinedIcon />}
						onClick={handleCommentOpenToggle}
					>
						{comments.length}
					</Button>
				</div>
			) : null}

			<Divider variant='middle' />

			<CardActions>
				<LikeButton
					userData={userData}
					post={post}
					allPosts={allPosts}
					setAllPosts={setAllPosts}
					isPost
				/>
				<Button
					className={classes.postButtons}
					startIcon={<ChatBubbleOutlineOutlinedIcon />}
					onClick={handleAddCommentOpenToggle}
				>
					Comment
				</Button>
			</CardActions>

			{((isCommentsOpen && post.comments.length > 0) || isAddCommentOpen) && (
				<Divider variant='middle' className={classes.bottomSpacing} />
			)}

			{isCommentsOpen && comments.length > 1 && !showMultipleComments && (
				<Container>
					<Button
						className={classes.bottomSpacing}
						onClick={handleShowMoreCommentsToggle}
					>{`View ${comments.length - 1} more comments`}</Button>
				</Container>
			)}

			{isCommentsOpen && showMultipleComments
				? commentComponents
				: isCommentsOpen && commentComponents[post.comments.length - 1]}

			{isAddCommentOpen && (
				<Container>
					<CommentForm
						userData={userData}
						post={post}
						allPosts={allPosts}
						setAllPosts={setAllPosts}
					/>
				</Container>
			)}
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
