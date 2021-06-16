import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FriendOptions from './FriendOptions';

import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, friendsListProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const UserCard = ({ user, friendsList }) => {
	const { firstName, lastName } = user;
	const classes = useStyles();

	return (
		<Container maxWidth='xs'>
			<Paper className={classes.userCardPaper}>
				<Container>
					<div className={classes.userCardInfo}>
						<Avatar
							src={setUserImageSource(user)}
							className={classes.sideSpacing}
						/>
						<Typography noWrap>{`${firstName} ${lastName}`}</Typography>
					</div>

					<div>
						<FriendOptions user={user} friendsList={friendsList} />
					</div>
				</Container>
			</Paper>
		</Container>
	);
};

UserCard.propTypes = {
	user: PropTypes.shape(userDataProp.user).isRequired,
	friendsList: PropTypes.arrayOf(PropTypes.shape(friendsListProp)).isRequired,
};

export default UserCard;
