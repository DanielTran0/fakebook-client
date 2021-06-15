import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';

import PostCard from '../components/PostCard';

import { postRequests } from '../util/axiosRequests';
import { userDataProp } from '../util/customPropTypes';

const Timeline = ({ userData }) => {
	const [allPosts, setAllPosts] = useState([]);
	console.log(allPosts);

	const fetchData = async () => {
		try {
			const postsResponse = await postRequests.getUserAndFriendPosts();
			setAllPosts(postsResponse.data.posts);
		} catch (error) {
			// TODO handle error
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

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
			{/* TODO make mobile post touch end of screen */}
			<Container maxWidth='sm'>{postCardComponents}</Container>
		</div>
	);
};

Timeline.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
};

export default Timeline;
