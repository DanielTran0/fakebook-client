import React from 'react';

import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const NotFound = () => {
	const isMobile = useMediaQuery('(max-width: 425px)');

	return (
		<Typography variant={isMobile ? 'h4' : 'h2'} align='center'>
			Page Not Found
		</Typography>
	);
};

export default NotFound;
