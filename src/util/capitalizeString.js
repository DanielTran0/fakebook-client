const capitalizeString = (string) => {
	if (!string) return 'user';
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

export default capitalizeString;
