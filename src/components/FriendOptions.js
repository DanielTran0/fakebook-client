import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { friendRequests } from '../util/axiosRequests';
import { userDataProp, friendsListProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const FriendOptions = ({ user, friendsList, setFriendsList }) => {
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

			if (setFriendsList) {
				const newFriendsList = [...friendsList];
				const friendIndex = friendsList.findIndex(
					(friend) => friend.user._id === user._id
				);

				if (friendIndex === -1) return null;

				newFriendsList[friendIndex].status = 'friends';

				setFriendsList(newFriendsList);
			}
			return null;
		} catch (error) {
			return console.log(error.response.data.errors);
		}
	};

	const handleRejectFriend = async () => {
		try {
			await friendRequests.putChangeFriendRequest(user._id, 'reject');
			setFriendStatus('');

			if (setFriendsList) {
				const newFriendsList = [...friendsList];
				const friendIndex = friendsList.findIndex(
					(friend) => friend.user._id === user._id
				);

				if (friendIndex === -1) return null;

				newFriendsList.splice(friendIndex, 1);

				setFriendsList(newFriendsList);
			}
			return null;
		} catch (error) {
			return console.log(error.response.data.errors);
		}
	};

	const handleCancelPendingOrDeleteFriend = async () => {
		try {
			await friendRequests.deleteFriendOrRequest(user._id);
			setFriendStatus('');

			if (setFriendsList) {
				const newFriendsList = [...friendsList];
				const friendIndex = friendsList.findIndex(
					(friend) => friend.user._id === user._id
				);

				if (friendIndex === -1) return null;

				newFriendsList.splice(friendIndex, 1);

				setFriendsList(newFriendsList);
			}

			return null;
		} catch (error) {
			return console.log(error.response.data.errors);
		}
	};

	let friendOption = (
		<Button
			variant='contained'
			size='small'
			color='primary'
			onClick={handleAddFriend}
		>
			Add
		</Button>
	);

	if (friendStatus === 'outgoing') {
		friendOption = (
			<Button
				variant='contained'
				size='small'
				color='secondary'
				onClick={handleCancelPendingOrDeleteFriend}
			>
				Cancel
			</Button>
		);
	}

	if (friendStatus === 'incoming') {
		friendOption = (
			<div className={classes.friendIncoming}>
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
			<Button
				variant='contained'
				size='small'
				onClick={handleCancelPendingOrDeleteFriend}
			>
				Remove
			</Button>
		);
	}
	return <div>{friendOption}</div>;
};

FriendOptions.propTypes = {
	user: PropTypes.shape(userDataProp.user).isRequired,
	friendsList: PropTypes.arrayOf(PropTypes.shape(friendsListProp)).isRequired,
	setFriendsList: PropTypes.func,
};

FriendOptions.defaultProps = {
	setFriendsList: null,
};

export default FriendOptions;
