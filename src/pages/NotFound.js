import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const NotFound = ({ setActiveTab }) => {
	const isMobile = useMediaQuery('(max-width: 425px)');

	useEffect(() => {
		setActiveTab('');
	}, [setActiveTab]);

	return (
		<Typography variant={isMobile ? 'h4' : 'h2'} align='center'>
			Page Not Found
		</Typography>
	);
};

NotFound.propTypes = {
	setActiveTab: PropTypes.func.isRequired,
};

export default NotFound;
