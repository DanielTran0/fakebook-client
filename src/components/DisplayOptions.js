import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import useStateWithLocalStorage from '../util/localStorageHook';

const useStyles = makeStyles({
	header: {
		fontWeight: 'normal',
		marginBottom: 10,
	},
});

const DisplayOptions = () => {
	const [displayOptions, setDisplayOptions] = useStateWithLocalStorage(
		'displayOptions',
		{ showAddComment: true, showLastComment: true }
	);
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const classes = useStyles();

	const handleDisplayToggle = (e) => {
		const { name } = e.target;
		setDisplayOptions({ ...displayOptions, [name]: !displayOptions[name] });
	};

	return (
		<div>
			<Typography
				className={classes.header}
				variant={isSmallScreen ? 'h6' : 'h5'}
			>
				Home/Timeline
			</Typography>

			<FormControlLabel
				control={
					<Switch
						checked={displayOptions.showAddComment}
						onChange={handleDisplayToggle}
						name='showAddComment'
						color='primary'
					/>
				}
				label='Always show add comment'
				labelPlacement='start'
			/>

			<FormControlLabel
				control={
					<Switch
						checked={displayOptions.showLastComment}
						onChange={handleDisplayToggle}
						name='showLastComment'
						color='primary'
					/>
				}
				label='Always show last comment'
				labelPlacement='start'
			/>
		</div>
	);
};

export default DisplayOptions;
