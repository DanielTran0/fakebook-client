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

export { userDataProp, setUserDataProp };
