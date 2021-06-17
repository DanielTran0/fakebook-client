import { useEffect, useState } from 'react';

import axiosInstance from './axiosRequests';

const useStateWithLocalStorage = (localStorageKey) => {
	const initialState = localStorageKey === 'fakebook-user' ? {} : '';
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(localStorageKey)) || initialState
	);

	useEffect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(value));
	}, [value, localStorageKey]);

	if (localStorageKey === 'fakebook-token' && value !== '')
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${value}`;

	return [value, setValue];
};

export default useStateWithLocalStorage;
