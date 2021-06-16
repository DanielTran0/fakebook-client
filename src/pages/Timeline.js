import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import PostCard from '../components/PostCard';

import { postRequests } from '../util/axiosRequests';
import { userDataProp, postProp } from '../util/customPropTypes';

const Timeline = ({ userData, allPosts, setAllPosts }) => {
	const isMobile = useMediaQuery('(max-width: 425px)');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const postsResponse = await postRequests.getUserAndFriendPosts();
				setAllPosts(postsResponse.data.posts);
			} catch (error) {
				// TODO handle error
				console.log(error.response);
			}
		};

		fetchData();
	}, [setAllPosts]);

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
				{postCardComponents}
			</Container>
		</div>
	);
};

Timeline.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default Timeline;
