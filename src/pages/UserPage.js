import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core';

import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import ModalBackgroundForm from '../components/forms/ModalBackgroundForm';

import {
	userRequests,
	postRequests,
	friendRequests,
} from '../util/axiosRequests';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles((theme) => {
	return {
		flex: {
			display: 'flex',
		},
		capitalize: {
			textTransform: 'capitalize',
		},
		center: {
			margin: 'auto',
		},
		avatarLargeMobile: {
			margin: 'auto',
			marginTop: -theme.spacing(8),
			width: theme.spacing(13),
			height: theme.spacing(13),
			marginBottom: theme.spacing(1),
			border: '3px solid black',
		},
		background: {
			position: 'relative',
		},
		imageButton: {
			position: 'absolute',
			bottom: '5%',
			right: '2%',
		},
	};
});

// TODO leak

const UserPage = ({ match, userData, setUserData }) => {
	const { params } = match;
	const [isLoading, setILoading] = useState(true);
	const [userInfo, setUserInfo] = useState({});
	const [userPosts, setUserPosts] = useState([]);
	const [userFriends, setUserFriends] = useState([]);
	const [currentUserFriends, setCurrentUserFriends] = useState([]);
	const [tabValue, setTabValue] = useState('0');
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await Promise.all([
					userRequests.getAnotherUser(params.userId),
					postRequests.getAnotherUserPosts(params.userId),
					friendRequests.getAnotherUserFriends(params.userId),
					friendRequests.getUserFriends(),
				]);

				setUserInfo(response[0].data.user);
				setUserPosts(response[1].data.posts);
				setUserFriends(response[2].data.friends);
				setCurrentUserFriends(response[3].data.friends);
				setILoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, [params]);

	const handleTabChange = (e, newTabValue) => {
		setTabValue(newTabValue);
	};

	const postCardComponents = userPosts.map((post) => (
		<PostCard
			key={post._id}
			userData={userData}
			post={post}
			allPosts={userPosts}
			setAllPosts={setUserPosts}
		/>
	));

	const userCardComponents = userFriends.map((friend) => (
		<UserCard
			user={friend.user}
			key={friend.user._id}
			friendsList={currentUserFriends}
		/>
	));

	return isLoading ? (
		<div className={classes.flex}>
			<CircularProgress className={classes.center} />
		</div>
	) : (
		<Container maxWidth='sm' disableGutters={isMobile}>
			<div className={classes.background}>
				<img src={setUserImageSource(userInfo, true)} alt='background' />

				{userData.user._id === userInfo._id && (
					<div className={classes.imageButton}>
						<ModalBackgroundForm
							userData={userData}
							setUserData={setUserData}
						/>
					</div>
				)}
			</div>

			<Avatar
				className={classes.avatarLargeMobile}
				src={setUserImageSource(userInfo)}
			/>

			<Typography className={classes.capitalize} variant='h6' align='center'>
				{userInfo.firstName} {userInfo.lastName}
			</Typography>

			<Paper>
				<TabContext value={tabValue}>
					<Tabs value={tabValue} onChange={handleTabChange} centered>
						<Tab label='Posts' value='0' />
						<Tab label='Friends' value='1' />
					</Tabs>

					<TabPanel value='0'>{postCardComponents}</TabPanel>

					<TabPanel value='1'>{userCardComponents}</TabPanel>
				</TabContext>
			</Paper>
		</Container>
	);
};

UserPage.propTypes = {
	match: PropTypes.shape({
		path: PropTypes.string,
		url: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.shape({ userId: PropTypes.string }),
	}).isRequired,
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default UserPage;
