import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import UserCard from '../components/UserCard';

import { friendRequests } from '../util/axiosRequests';
import { setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: { marginBottom: 15 },
	unbold: { fontWeight: 'normal' },
});

const Friends = ({ setUserData, setActiveTab }) => {
	const [friendsList, setFriendsList] = useState([]);
	const [currentFriends, setCurrentFriends] = useState([]);
	const [pendingFriends, setPendingFriends] = useState([]);
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const friendResponse = await friendRequests.getUserFriends();
				const { friends } = friendResponse.data;
				friends.sort((a, b) =>
					a.user.lastName.toUpperCase() > b.user.lastName.toUpperCase() ? 1 : -1
				);
				setFriendsList(friends);
			} catch (error) {
				enqueueSnackbar(error.message, { variant: 'error' });
			}
		};

		setActiveTab('friends');
		fetchData();
	}, [setUserData, enqueueSnackbar, setActiveTab]);

	useEffect(() => {
		const current = [];
		const pending = [];

		friendsList.forEach((friend) => {
			if (friend.status === 'friends') return current.push(friend);

			return pending.push(friend);
		});

		setCurrentFriends(current);
		setPendingFriends(pending);
	}, [friendsList]);

	const friendUserCardComponents = currentFriends.map((friend) => (
		<UserCard
			user={friend.user}
			friendsList={friendsList}
			setFriendsList={setFriendsList}
			key={friend.user._id}
		/>
	));

	const pendingUserCardComponents = pendingFriends.map((friend) => (
		<UserCard
			user={friend.user}
			friendsList={friendsList}
			setFriendsList={setFriendsList}
			key={friend.user._id}
		/>
	));

	return (
		<Container maxWidth='sm'>
			<div className={classes.bottomSpacing}>
				<Typography
					className={classes.bottomSpacing}
					variant={isSmallScreen ? 'h5' : 'h4'}
					align='left'
				>
					Friends
				</Typography>
				{currentFriends.length > 0 ? (
					friendUserCardComponents
				) : (
					<Typography
						variant={isSmallScreen ? 'body1' : 'h6'}
						className={classes.unbold}
					>
						Find friends by browsing the all users page
					</Typography>
				)}
			</div>

			<div>
				<Typography
					className={classes.bottomSpacing}
					variant={isSmallScreen ? 'h5' : 'h4'}
					align='left'
				>
					Pending Requests
				</Typography>
				{pendingFriends.length > 0 ? (
					pendingUserCardComponents
				) : (
					<Typography
						variant={isSmallScreen ? 'body1' : 'h6'}
						className={classes.unbold}
					>
						Currently no requests
					</Typography>
				)}
			</div>
		</Container>
	);
};

Friends.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	setActiveTab: PropTypes.func.isRequired,
};

export default Friends;
