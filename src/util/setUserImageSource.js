const setUserImageSource = (user, isBackground) => {
	if (isBackground) {
		const userBackgroundImageUrl = user.backgroundImage?.split('-');
		let imageUrl = `http://localhost:5000/static/images/users/default-background.jpg`;

		// TODO replace url

		if (userBackgroundImageUrl?.[0] === 'userImage')
			imageUrl = `http://localhost:5000/static/images/users/${user.backgroundImage}`;

		return imageUrl;
	}

	const userProfileImageUrl = user.profileImage?.split('-');
	let imageUrl = user.profileImage;

	// TODO replace url
	if (userProfileImageUrl?.[0] === 'userImage')
		imageUrl = `http://localhost:5000/static/images/users/${user.profileImage}`;

	return imageUrl;
};

export default setUserImageSource;
