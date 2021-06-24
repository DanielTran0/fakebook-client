import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import UserCard from '../components/UserCard';

import { userRequests, friendRequests } from '../util/axiosRequests';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: {
		marginBottom: 15,
	},
	center: {
		display: 'flex',
		justifyContent: 'center',
	},
});

const AllUsers = ({ userData, setUserData, setActiveTab }) => {
	const [users, setUsers] = useState([]);
	const [friendsList, setFriendsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

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

				setIsLoading(false);
				setFriendsList(friendResponse.data.friends);
				return setUsers(newUsers);
			} catch (error) {
				return enqueueSnackbar(error.message, { variant: 'error' });
			}
		};

		fetchData();
	}, [userData, setUserData, enqueueSnackbar]);

	const userCardComponents = users.map((user) => (
		<UserCard
			user={user}
			key={user._id}
			friendsList={friendsList}
			setActiveTab={setActiveTab}
		/>
	));

	return (
		<Container maxWidth='sm'>
			<Typography
				variant={isSmallScreen ? 'h5' : 'h4'}
				align='center'
				className={classes.bottomSpacing}
			>
				All Users
			</Typography>

			{userCardComponents}

			{isLoading && (
				<div className={classes.center}>
					<CircularProgress />
				</div>
			)}
		</Container>
	);
};

AllUsers.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	setActiveTab: PropTypes.func.isRequired,
};

export default AllUsers;
