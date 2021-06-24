import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { friendRequests } from '../util/axiosRequests';
import { userDataProp, friendsListProp } from '../util/customPropTypes';

const useStyles = makeStyles((theme) => ({
	deleteButton: {
		backgroundColor: '#d32f2f',
		color: '#fff',
	},
	acceptButton: {
		backgroundColor: theme.palette.secondary.main,
		color: '#fff',
	},
	friendIncoming: {
		display: 'flex',
		flexDirection: 'column',
	},
}));

const FriendOptions = ({ user, friendsList, setFriendsList }) => {
	const [friendStatus, setFriendStatus] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const friendListIndex = friendsList.findIndex(
		(friend) => friend.user._id === user._id
	);

	useEffect(() => {
		if (friendListIndex !== -1)
			setFriendStatus(friendsList[friendListIndex].status);
	}, [friendListIndex, friendsList]);

	const handleAddFriend = async () => {
		try {
			await friendRequests.postNewFriendRequest(user._id);
			return setFriendStatus('outgoing');
		} catch (error) {
			if (error.response) {
				console.log(error.response);
				return enqueueSnackbar(error.response.data.errors[0].msg, {
					variant: 'error',
				});
			}

			return enqueueSnackbar(error.message, { variant: 'error' });
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
			if (error.response) {
				return enqueueSnackbar(error.response.data.errors[0].msg, {
					variant: 'error',
				});
			}

			return enqueueSnackbar(error.message, { variant: 'error' });
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
			if (error.response) {
				return enqueueSnackbar(error.response.data.errors[0].msg, {
					variant: 'error',
				});
			}

			return enqueueSnackbar(error.message, { variant: 'error' });
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
			if (error.response) {
				return enqueueSnackbar(error.response.data.errors[0].msg, {
					variant: 'error',
				});
			}

			return enqueueSnackbar(error.message, { variant: 'error' });
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
				onClick={handleCancelPendingOrDeleteFriend}
				className={classes.deleteButton}
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
					color='secondary'
					onClick={handleAcceptFriend}
					className={classes.acceptButton}
				>
					Accept
				</Button>
				<Button
					variant='contained'
					size='small'
					onClick={handleRejectFriend}
					className={classes.deleteButton}
				>
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
				className={classes.deleteButton}
			>
				Remove
			</Button>
		);
	}
	return friendOption;
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
