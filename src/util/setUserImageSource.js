const setUserImageSource = (user) => {
	const userProfileImageUrl = user.profileImage?.split('-');
	let imageUrl = '';

	console.log(user.profileImage, userProfileImageUrl);
	// TODO replace url
	if (userProfileImageUrl?.[0] === 'userImage')
		imageUrl = `http://localhost:5000/static/images/users/${user.profileImage}`;
	if (userProfileImageUrl?.[0] !== '') imageUrl = user.profileImage;

	return imageUrl;
};

export default setUserImageSource;
