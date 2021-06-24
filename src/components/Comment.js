import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import MenuOptions from './MenuOptions';
import LikeButton from './LikeButton';

import useStateWithLocalStorage from '../util/localStorageHook';
import formatDate from '../util/formatDate';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, postProp, commentProp } from '../util/customPropTypes';

const useStyles = makeStyles((theme) => ({
	commentBody: {
		display: 'flex',
		marginBottom: 20,
	},
	capitalize: {
		textTransform: 'capitalize',
		fontWeight: 'bold',
	},
	textBody: {
		display: 'inline-text',
		padding: '5px 10px',
		borderRadius: 10,
		minWidth: 120,
		backgroundColor: (props) => props.backgroundColorText,
	},
	flex: {
		display: 'flex',
	},
	breakText: {
		wordBreak: 'break-word',
	},
	commentRight: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	anchor: {
		position: 'relative',
		height: 0,
		width: 0,
	},
	likeInfo: {
		display: 'flex',
		alignItems: 'center',
		position: 'absolute',
		top: -10,
		left: -30,
		padding: '5px 10px',
		borderRadius: 20,
		backgroundColor: (props) => props.backgroundColorLike,
	},
	likeInfoIcon: {
		height: 22,
		width: 22,
		padding: '0px 5px',
		marginRight: 5,
		borderRadius: 20,
		color: 'white',
		backgroundColor: theme.palette.primary.main,
	},
	footer: {
		display: 'flex',
		marginTop: 10,
	},
}));

const Comments = ({ userData, post, allPosts, setAllPosts, comment }) => {
	const { user, text, date, likes } = comment;
	const [colourMode] = useStateWithLocalStorage('colourMode', 'light');
	const styleProps = {
		backgroundColorText: colourMode === 'light' ? '#dedede' : '#555',
		backgroundColorLike: colourMode === 'light' ? '#ededed' : '#999',
	};
	const classes = useStyles(styleProps);

	return (
		<Container className={classes.commentBody}>
			<Link href={`#/user/${user._id}`}>
				<Avatar src={setUserImageSource(user)} />
			</Link>

			<div>
				<Container className={classes.flex}>
					<div className={classes.textBody}>
						<Link href={`#/user/${user._id}`} underline='none'>
							<Typography
								color='textPrimary'
								className={classes.capitalize}
							>{`${user.firstName} ${user.lastName}`}</Typography>
						</Link>

						<Typography className={classes.breakText}>{text}</Typography>
					</div>

					<div className={classes.commentRight}>
						<div>
							{user._id === userData.user._id && (
								<MenuOptions
									post={post}
									allPosts={allPosts}
									setAllPosts={setAllPosts}
									comment={comment}
								/>
							)}
						</div>

						{likes.length > 0 && (
							<div className={classes.anchor}>
								<div className={classes.likeInfo}>
									<ThumbUpIcon
										fontSize='small'
										className={classes.likeInfoIcon}
									/>
									<Typography variant='subtitle2'>{likes.length}</Typography>
								</div>
							</div>
						)}
					</div>
				</Container>

				<div className={classes.footer}>
					<LikeButton
						userData={userData}
						post={post}
						allPosts={allPosts}
						setAllPosts={setAllPosts}
						comment={comment}
					/>

					<Typography variant='subtitle2'>{formatDate(date, true)}</Typography>
				</div>
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
