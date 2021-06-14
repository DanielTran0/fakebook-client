import PropTypes from 'prop-types';

const userDataProp = {
	user: PropTypes.shape({
		_id: PropTypes.string,
		email: PropTypes.string,
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		profileImage: PropTypes.string,
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
	postImage: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	likes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	user: PropTypes.shape(userDataProp.user),
};

export { userDataProp, setUserDataProp, postProp };
