import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import FriendOptions from './FriendOptions';

import useStateWithLocalStorage from '../util/localStorageHook';
import { userDataProp, friendsListProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: {
		marginBottom: 15,
	},
	paperPadding: {
		padding: '15px 0',
	},
	cardSpacing: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cardInfo: {
		display: 'flex',
		alignItems: 'center',
		maxWidth: '65%',
	},
	sideSpacing: {
		marginRight: 10,
	},
	capitalize: {
		textTransform: 'capitalize',
	},
});

const UserCard = ({ user, friendsList, setFriendsList }) => {
	const { firstName, lastName } = user;
	const [currentUser] = useStateWithLocalStorage('user', {});
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const classes = useStyles();

	return (
		<Container
			maxWidth='xs'
			disableGutters={isSmallScreen}
			className={classes.bottomSpacing}
		>
			<Paper className={classes.paperPadding}>
				<Container className={classes.cardSpacing}>
					<Link
						href={`#/user/${user._id}`}
						underline='none'
						color='textPrimary'
						className={classes.cardInfo}
					>
						<Avatar
							className={classes.sideSpacing}
							src={user.profileImageUrl}
						/>
						<Typography className={classes.capitalize} noWrap>
							{firstName} {lastName}
						</Typography>
					</Link>

					{currentUser._id !== user._id && (
						<FriendOptions
							user={user}
							friendsList={friendsList}
							setFriendsList={setFriendsList}
						/>
					)}
				</Container>
			</Paper>
		</Container>
	);
};

UserCard.propTypes = {
	user: PropTypes.shape(userDataProp.user).isRequired,
	friendsList: PropTypes.arrayOf(PropTypes.shape(friendsListProp)).isRequired,
	setFriendsList: PropTypes.func,
};

UserCard.defaultProps = {
	setFriendsList: PropTypes.null,
};

export default UserCard;
