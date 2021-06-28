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
import { useSnackbar } from 'notistack';

import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import ModalUserPageForm from '../components/forms/ModalUserPageForm';

import {
	userRequests,
	postRequests,
	friendRequests,
} from '../util/axiosRequests';
import setUserBackgroundSource from '../util/setUserBackgroundSource';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles((theme) => ({
	center: {
		display: 'flex',
		justifyContent: 'center',
	},
	imageBackgroundBody: {
		display: 'flex',
		flexDirection: 'column',
	},
	buttonAnchor: {
		position: 'relative',
		alignSelf: 'flex-end',
	},
	changeButton: {
		position: 'absolute',
		bottom: -10,
		right: -10,
	},
	avatarAnchor: {
		position: 'relative',
		alignSelf: 'center',
	},
	avatar: {
		position: 'absolute',
		width: (props) => props.avatarSize,
		height: (props) => props.avatarSize,
		transform: `translate(-50%, -50%)`,
	},
	name: {
		display: 'flex',
		alignItems: 'center',
		marginTop: (props) => props.nameMargin,
		marginBottom: 10,
		textTransform: 'capitalize',
	},
	paperBackground: {
		background: theme.palette.type === 'dark' ? ' #222' : '#ddd',
	},
}));

const UserPage = ({ match, userData, setUserData, setActiveTab }) => {
	const { params } = match;
	const [isLoading, setILoading] = useState(true);
	const [userInfo, setUserInfo] = useState({});
	const [userPosts, setUserPosts] = useState([]);
	const [userFriends, setUserFriends] = useState([]);
	const [currentUserFriends, setCurrentUserFriends] = useState([]);
	const [tabValue, setTabValue] = useState('0');
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const { enqueueSnackbar } = useSnackbar();
	const styleProps = {
		avatarSize: isSmallScreen ? 75 : 150,
		nameMargin: isSmallScreen ? 35 : 85,
	};
	const classes = useStyles(styleProps);

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
				enqueueSnackbar(error.message, { variant: 'error' });
			}
		};

		setActiveTab('');
		fetchData();
	}, [params, setActiveTab, enqueueSnackbar]);

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
		<div className={classes.center}>
			<CircularProgress />
		</div>
	) : (
		<Container maxWidth='sm' disableGutters={isSmallScreen}>
			<div className={classes.imageBackgroundBody}>
				<img src={setUserBackgroundSource(userInfo)} alt='background' />

				<div className={classes.buttonAnchor}>
					{userData.user._id === userInfo._id && (
						<div className={classes.changeButton}>
							<ModalUserPageForm
								userData={userData}
								setUserData={setUserData}
							/>
						</div>
					)}
				</div>

				<div className={classes.avatarAnchor}>
					<Avatar className={classes.avatar} src={userInfo.profileImageUrl} />
				</div>
			</div>

			<div className={classes.center}>
				<Typography
					variant={isSmallScreen ? 'h5' : 'h4'}
					className={classes.name}
				>
					{userInfo.firstName} {userInfo.lastName}
					{userData.user._id === userInfo._id && (
						<ModalUserPageForm
							userData={userData}
							setUserData={setUserData}
							isProfile
						/>
					)}
				</Typography>
			</div>

			<Paper className={classes.paperBackground}>
				<TabContext value={tabValue}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor='primary'
						centered
					>
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
	setActiveTab: PropTypes.func.isRequired,
};

export default UserPage;
