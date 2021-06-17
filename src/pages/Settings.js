import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useStateWithLocalStorage from '../util/localStorageHook';
import useStyles from '../util/useStylesHook';

const Settings = (props) => {
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

	return (
		<Container maxWidth='sm'>
			<Paper>
				<Container maxWidth='sm'>
					<Typography
						className={classes.bottomSpacing}
						variant={isMobile ? 'h5' : 'h4'}
					>
						Settings
					</Typography>

					<div>
						<Typography
							className={classes.bottomSpacing}
							variant={isMobile ? 'h6' : 'h5'}
						>
							Home/Timeline
						</Typography>
						<Typography variant='body1'>Show last comment</Typography>
					</div>
				</Container>
			</Paper>
		</Container>
	);
};

Settings.propTypes = {};

export default Settings;
