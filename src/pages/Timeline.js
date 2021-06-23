import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import PostCard from '../components/PostCard';

import { postRequests } from '../util/axiosRequests';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({});

const Timeline = ({ userData, setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [allPosts, setAllPosts] = useState([]);
	const [skip, setSkip] = useState(0);
	const [isLoading, setILoading] = useState(true);
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

				return setILoading(false);
			} catch (error) {
				if ([401, 500].includes(error.response?.status)) {
					setUser({});
					setToken('');
					return localStorage.clear();
				}

				return enqueueSnackbar(error.message, { variant: 'error' });
			}
		};

		fetchData();
	}, [skip, enqueueSnackbar, setUser, setToken]);

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
			{allPosts.length === 0 && !isLoading && (
				<Typography variant={isSmallScreen ? 'h6' : 'h5'} align='center'>
					No Posts Available. Create one or add friends to view posts.
				</Typography>
			)}
			{postCardComponents}

			{isLoading && (
				<div className={classes.flex}>
					<CircularProgress className={classes.center} />
				</div>
			)}
		</Container>
	);
};

Timeline.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default Timeline;
