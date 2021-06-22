const handleErrors = (error, setUserData) => {
	const { setUser, setToken } = setUserData;

	// TODO
	// if ([500, 401].includes(error.response.status)) {
	// 	setUser({});
	// 	setToken('');
	// 	localStorage.clear();
	// }
	console.log(error);
};

export default handleErrors;
