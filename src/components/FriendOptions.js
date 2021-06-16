import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { friendRequests } from '../util/axiosRequests';
import { userDataProp, friendsListProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const FriendOptions = ({ user, friendsList }) => {
	const [friendStatus, setFriendStatus] = useState('');
	const classes = useStyles();

	const friendListIndex = friendsList.findIndex(
		(friend) => friend.user._id === user._id
	);

	useEffect(() => {
		if (friendListIndex !== -1)
			setFriendStatus(friendsList[friendListIndex].status);
	}, [friendListIndex, friendsList]);

	// TODO handle all errors
	const handleAddFriend = async () => {
		try {
			await friendRequests.postNewFriendRequest(user._id);
			setFriendStatus('outgoing');
		} catch (error) {
			console.log(error.response.data.errors);
		}
	};

	const handleAcceptFriend = async () => {
		try {
			await friendRequests.putChangeFriendRequest(user._id, 'accept');
			setFriendStatus('friends');
		} catch (error) {
			console.log(error.response.data.errors);
		}
	};

	const handleRejectFriend = async () => {
		try {
			await friendRequests.putChangeFriendRequest(user._id, 'reject');
			setFriendStatus('');
		} catch (error) {
			console.log(error.response.data.errors);
		}
	};

	const handleCancelPendingOrDeleteFriend = async () => {
		try {
			await friendRequests.deleteFriendOrRequest(user._id);
			setFriendStatus('');
		} catch (error) {
			console.log(error.response.data.errors);
		}
	};

	let friendOption = (
		<Button
			variant='contained'
			size='small'
			color='primary'
			onClick={handleAddFriend}
			fullWidth
		>
			Add Friend
		</Button>
	);

	if (friendStatus === 'outgoing') {
		friendOption = (
			<div className={classes.friendOption}>
				<Typography className={classes.sideSpacing}>Pending</Typography>
				<Button
					variant='contained'
					size='small'
					color='secondary'
					onClick={handleCancelPendingOrDeleteFriend}
				>
					Cancel
				</Button>
			</div>
		);
	}

	if (friendStatus === 'incoming') {
		friendOption = (
			<div className={classes.friendOption}>
				<Button
					variant='contained'
					size='small'
					color='primary'
					onClick={handleAcceptFriend}
				>
					Accept
				</Button>
				<Button variant='contained' size='small' onClick={handleRejectFriend}>
					Cancel
				</Button>
			</div>
		);
	}

	if (friendStatus === 'friends') {
		friendOption = (
			<div className={classes.friendOption}>
				<Button
					variant='contained'
					size='small'
					onClick={handleCancelPendingOrDeleteFriend}
					fullWidth
				>
					Remove
				</Button>
			</div>
		);
	}
	return <div>{friendOption}</div>;
};

FriendOptions.propTypes = {
	user: PropTypes.shape(userDataProp.user).isRequired,
	friendsList: PropTypes.arrayOf(PropTypes.shape(friendsListProp)).isRequired,
};

export default FriendOptions;
