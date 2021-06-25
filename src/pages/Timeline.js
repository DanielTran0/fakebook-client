import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import PostCard from '../components/PostCard';
import PostForm from '../components/forms/PostForm';

import { postRequests } from '../util/axiosRequests';
import capitalizeString from '../util/capitalizeString';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	center: {
		display: 'flex',
		justifyContent: 'center',
	},
	addPost: {
		padding: '20px 0px',
		marginBottom: 20,
	},
	bottomSpacing: {
		marginBottom: 10,
	},
});

const Timeline = ({ userData, setUserData, setActiveTab }) => {
	const { setUser, setToken } = setUserData;
	const { firstName } = userData.user;
	const [allPosts, setAllPosts] = useState([]);
	const [skip, setSkip] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const postsResponse = await postRequests.getUserAndFriendPosts(skip);
				const { posts } = postsResponse.data;

				if (skip === 0) setAllPosts(posts);
				if (skip !== 0)
					setAllPosts((oldAllPosts) => [...oldAllPosts, ...posts]);

				return setIsLoading(false);
			} catch (error) {
				if ([401, 500].includes(error.response?.status)) {
					setUser({});
					setToken('');
					return localStorage.clear();
				}

				return enqueueSnackbar(error.message, { variant: 'error' });
			}
		};

		setIsLoading(true);
		setActiveTab('home');
		fetchData();
	}, [skip, enqueueSnackbar, setUser, setToken, setActiveTab]);

	useEffect(() => {
		const handleScrollLoading = () => {
			if (skip === allPosts.length) return null;

			if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
				setSkip(allPosts.length);
			}

			return null;
		};

		window.addEventListener('scroll', handleScrollLoading);

		return () => window.removeEventListener('scroll', handleScrollLoading);
	}, [allPosts, skip]);

	const postCardComponents = allPosts.map((post) => (
		<PostCard
			key={post._id}
			userData={userData}
			post={post}
			allPosts={allPosts}
			setAllPosts={setAllPosts}
		/>
	));

	return (
		<Container disableGutters={isSmallScreen} maxWidth='sm'>
			<Paper className={classes.addPost}>
				<Container>
					<Typography variant='subtitle2' className={classes.bottomSpacing}>
						Max image size of 1.5 MB
					</Typography>

					<PostForm name={capitalizeString(firstName)} />
				</Container>
			</Paper>

			{allPosts.length === 0 && !isLoading && (
				<Typography variant={isSmallScreen ? 'h6' : 'h5'} align='center'>
					No Posts Available. Create one or add friends to view posts.
				</Typography>
			)}

			{postCardComponents}

			{isLoading && (
				<div className={classes.center}>
					<CircularProgress />
				</div>
			)}
		</Container>
	);
};

Timeline.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	setActiveTab: PropTypes.func.isRequired,
};

export default Timeline;
