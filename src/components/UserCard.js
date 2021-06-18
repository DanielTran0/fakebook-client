import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import FriendOptions from './FriendOptions';

import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, friendsListProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const UserCard = ({ user, friendsList, setFriendsList }) => {
	const { firstName, lastName } = user;
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

	return (
		<Container
			className={classes.bottomSpacing}
			maxWidth='xs'
			disableGutters={isMobile}
		>
			<Paper className={classes.userCardPaper}>
				<Container className={classes.userCardSpacing}>
					<Link to={`/user/${user._id}`} className={classes.userCardInfo}>
						<Avatar
							className={classes.sideSpacing}
							src={setUserImageSource(user)}
						/>
						<Typography className={classes.capitalize} noWrap>
							{`${firstName} ${lastName}`}
						</Typography>
					</Link>

					<FriendOptions
						user={user}
						friendsList={friendsList}
						setFriendsList={setFriendsList}
					/>
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
