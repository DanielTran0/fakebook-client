import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import UserCard from '../components/UserCard';

import { userRequests, friendRequests } from '../util/axiosRequests';
import { userDataProp } from '../util/customPropTypes';

const AllUsers = ({ userData }) => {
	const [users, setUsers] = useState([]);
	const [friendsList, setFriendsList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userResponse = await userRequests.getAllUsers();
				const friendResponse = await friendRequests.getUserFriends();
				const { users: newAllUsers } = userResponse.data;
				const newUsers = [...newAllUsers];
				const currentUserIndex = newUsers.findIndex(
					(user) => user._id === userData.user._id
				);

				if (currentUserIndex === -1) return null;

				newUsers.splice(currentUserIndex, 1);

				setFriendsList(friendResponse.data.friends);
				return setUsers(newUsers);
			} catch (error) {
				// TODO handle error
				return console.log(error.response);
			}
		};

		fetchData();
	}, [userData]);

	const userCardComponents = users.map((user) => (
		<UserCard user={user} key={user._id} friendsList={friendsList} />
	));

	return (
		<div>
			<Typography variant='h4' align='center'>
				All Users
			</Typography>
			<Container>{userCardComponents}</Container>
		</div>
	);
};

AllUsers.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
};

export default AllUsers;
