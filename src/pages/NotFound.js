import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const NotFound = ({ setActiveTab }) => {
	const isSmallScreen = useMediaQuery('(max-width: 599px)');

	useEffect(() => {
		setActiveTab('');
	}, [setActiveTab]);

	return (
		<Typography variant={isSmallScreen ? 'h5' : 'h4'} align='center'>
			Page Not Found
		</Typography>
	);
};

NotFound.propTypes = {
	setActiveTab: PropTypes.func.isRequired,
};

export default NotFound;
