const setUserBackgroundSource = (user) => {
	if (user.backgroundImageUrl !== '') return user.backgroundImage;

	return `https://res.cloudinary.com/hi2ciqzmq/image/upload/v1624739376/users/default_h5scrw.jpg`;
};

export default setUserBackgroundSource;
