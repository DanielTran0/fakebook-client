import axios from 'axios';

const axiosInstance = axios.create({
	// TODO replace url
	baseURL: 'http://localhost:5000/api',
});

// User requests
const getAllUsers = () => {
	return axiosInstance.get('/users');
};

const getAnotherUser = (userId) => {
	return axiosInstance.get(`/users/${userId}`);
};

const postNewUser = (accountDetails) => {
	return axiosInstance.post(`/users`, {
		...accountDetails,
	});
};

const putUpdateUser = (
	userId,
	{
		firstName,
		lastName,
		email,
		password,
		newPassword,
		newPasswordConfirmation,
		lastImage,
		userImage,
		isBackground,
	}
) => {
	const bodyFormData = new FormData();
	bodyFormData.append('firstName', firstName);
	bodyFormData.append('lastName', lastName);
	bodyFormData.append('email', email);
	bodyFormData.append('password', password);
	bodyFormData.append('newPassword', newPassword);
	bodyFormData.append('newPasswordConfirmation', newPasswordConfirmation);
	bodyFormData.append('lastImage', lastImage);
	bodyFormData.append('userImage', userImage);
	bodyFormData.append('isBackground', isBackground);

	return axiosInstance({
		method: 'put',
		url: `/users/${userId}`,
		data: bodyFormData,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

const userRequests = {
	getAllUsers,
	getAnotherUser,
	postNewUser,
	putUpdateUser,
};

// Session requests
const postNewSession = (loginDetails) => {
	return axiosInstance.post(`/sessions/email`, { ...loginDetails });
};

const postFacebookLogin = () => {
	return axiosInstance.post(`/sessions/facebook`);
};

const sessionRequests = {
	postNewSession,
	postFacebookLogin,
};

// Friend requests
const getUserFriends = () => {
	return axiosInstance.get(`/friends`);
};

const getAnotherUserFriends = (userId) => {
	return axiosInstance.get(`/friends/${userId}`);
};

const postNewFriendRequest = (userId) => {
	return axiosInstance.post(`/friends/${userId}`);
};

const putChangeFriendRequest = (userId, option) => {
	return axiosInstance.put(`/friends/${userId}`, { option });
};

const deleteFriendOrRequest = (userId) => {
	return axiosInstance.delete(`/friends/${userId}`);
};

const friendRequests = {
	getUserFriends,
	getAnotherUserFriends,
	postNewFriendRequest,
	putChangeFriendRequest,
	deleteFriendOrRequest,
};

// Post requests
const getUserAndFriendPosts = (skip) => {
	return axiosInstance.get(`/posts/`, { params: { skip } });
};

const getAnotherUserPosts = (userId) => {
	return axiosInstance.get(`/posts/${userId}`);
};

const postNewPost = ({ text, postImage }) => {
	const bodyFormData = new FormData();
	bodyFormData.append('text', text);
	bodyFormData.append('postImage', postImage);

	return axiosInstance({
		method: 'post',
		url: '/posts',
		data: bodyFormData,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

const putEditPost = ({ postId, text, postImage, lastImage }) => {
	const bodyFormData = new FormData();
	bodyFormData.append('text', text);
	bodyFormData.append('postImage', postImage);
	bodyFormData.append('lastImage', lastImage);

	return axiosInstance({
		method: 'put',
		url: `/posts/${postId}`,
		data: bodyFormData,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

const deletePost = (postId) => {
	return axiosInstance.delete(`/posts/${postId}`);
};

const postRequests = {
	getUserAndFriendPosts,
	getAnotherUserPosts,
	postNewPost,
	putEditPost,
	deletePost,
};

// Comment requests
const postNewComment = (postId, commentDetails) => {
	return axiosInstance.post(`/comments/${postId}`, { ...commentDetails });
};

const putEditComment = (postId, commentId, commentDetails) => {
	return axiosInstance.put(`/comments/${commentId}`, {
		postId,
		...commentDetails,
	});
};

const deleteComment = (postId, commentId) => {
	return axiosInstance.delete(`/comments/${commentId}`, { data: { postId } });
};

const commentRequests = { postNewComment, putEditComment, deleteComment };

// Like requests
const putLikePost = (postId) => {
	return axiosInstance.put(`/likes/posts/${postId}`);
};

const putLikeComment = (postId, commentId) => {
	return axiosInstance.put(`/likes/comments/${commentId}`, { postId });
};

const likeRequests = { putLikePost, putLikeComment };

export default axiosInstance;
export {
	userRequests,
	sessionRequests,
	friendRequests,
	postRequests,
	commentRequests,
	likeRequests,
};
