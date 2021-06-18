const setUserImageSource = (user) => {
	const userProfileImageUrl = user.profileImage?.split('-');
	let imageUrl = user.profileImage;

	// TODO replace url
	if (userProfileImageUrl?.[0] === 'userImage')
		imageUrl = `http://localhost:5000/static/images/users/${user.profileImage}`;

	return imageUrl;
};

export default setUserImageSource;
