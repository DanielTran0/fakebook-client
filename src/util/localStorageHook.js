import { useEffect, useState } from 'react';

import axiosInstance from './axiosRequests';

const useStateWithLocalStorage = (localStorageKey, initialState) => {
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(localStorageKey)) || initialState
	);

	useEffect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(value));
	}, [value, localStorageKey]);

	if (localStorageKey === 'token' && value !== '')
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${value}`;
	if (localStorageKey === 'token' && value === '')
		axiosInstance.defaults.headers.common.Authorization = '';

	return [value, setValue];
};

export default useStateWithLocalStorage;
