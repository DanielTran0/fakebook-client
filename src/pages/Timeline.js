import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import PostCard from '../components/PostCard';

import { postRequests } from '../util/axiosRequests';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';
import handleErrors from '../util/handleErrors';

const Timeline = ({ userData, setUserData }) => {
	const [allPosts, setAllPosts] = useState([]);
	const [skip, setSkip] = useState(0);
	const [isLoading, setILoading] = useState(true);
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

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
	}, [allPosts.length, skip]);

	useEffect(() => {
		setILoading(true);

		const fetchData = async () => {
			try {
				const postsResponse = await postRequests.getUserAndFriendPosts(skip);
				const { posts } = postsResponse.data;

				if (skip === 0) setAllPosts(posts);
				if (skip !== 0)
					setAllPosts((oldAllPosts) => [...oldAllPosts, ...posts]);

				setILoading(false);
			} catch (error) {
				handleErrors(error, setUserData);
			}
		};

		fetchData();
	}, [skip, setUserData]);

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
		<div className='timeline'>
			<Container disableGutters={isMobile} maxWidth='sm'>
				{allPosts.length === 0 && !isLoading && (
					<Typography variant={isMobile ? 'h6' : 'h5'} align='center'>
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
		</div>
	);
};

Timeline.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default Timeline;
