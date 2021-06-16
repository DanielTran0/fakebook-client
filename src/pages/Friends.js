import React, { useEffect, useState } from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import UserCard from '../components/UserCard';

import { friendRequests } from '../util/axiosRequests';
import useStyles from '../util/useStylesHook';

const Friends = () => {
	const [friendsList, setFriendsList] = useState([]);
	const [currentFriends, setCurrentFriends] = useState([]);
	const [pendingFriends, setPendingFriends] = useState([]);
	const isMobile = useMediaQuery('(max-width: 425px)');
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
				// TODO handle error
				console.log(error.response);
			}
		};

		fetchData();
	}, []);

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
					variant={isMobile ? 'h5' : 'h4'}
					align='left'
				>
					Friends
				</Typography>
				{currentFriends.length > 0 ? (
					friendUserCardComponents
				) : (
					<Typography>
						Find friends by checking out all fakebook users
					</Typography>
				)}
			</div>

			<div>
				<Typography
					className={classes.bottomSpacing}
					variant={isMobile ? 'h5' : 'h4'}
					align='left'
				>
					Pending Requests
				</Typography>
				{pendingUserCardComponents}
			</div>
		</Container>
	);
};

export default Friends;
