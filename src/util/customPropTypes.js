import PropTypes from 'prop-types';

const userDataProp = {
	user: PropTypes.shape({
		_id: PropTypes.string,
		email: PropTypes.string,
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		profileImageUrl: PropTypes.string,
		backgroundImageUrl: PropTypes.string,
	}).isRequired,
	token: PropTypes.string.isRequired,
};

const setUserDataProp = {
	setUser: PropTypes.func.isRequired,
	setToken: PropTypes.func.isRequired,
};

const postProp = {
	_id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	postImageUrl: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	likes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	user: PropTypes.shape(userDataProp.user),
};

const commentProp = {
	_id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	user: PropTypes.shape(userDataProp.user).isRequired,
	likes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const friendsListProp = {
	user: PropTypes.shape(userDataProp.user).isRequired,
	status: PropTypes.string.isRequired,
};

const colourModeObjectProp = {
	colourMode: PropTypes.string.isRequired,
	setColourMode: PropTypes.func.isRequired,
};

export {
	userDataProp,
	setUserDataProp,
	postProp,
	commentProp,
	friendsListProp,
	colourModeObjectProp,
};
