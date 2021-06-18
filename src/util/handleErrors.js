const handleErrors = (error, setUserData) => {
	const { setUser, setToken } = setUserData;

	if ([500, 401].includes(error.response.status)) {
		setUser({});
		setToken('');
		localStorage.clear();
	}
};

export default handleErrors;
