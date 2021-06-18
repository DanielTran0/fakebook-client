import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useStateWithLocalStorage from '../util/localStorageHook';
import useStyles from '../util/useStylesHook';

const DisplayOptions = () => {
	const [displayOptions, setDisplayOptions] = useStateWithLocalStorage(
		'displayOptions',
		{ showAddComment: true, showLastComment: true }
	);
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

	const handleDisplayToggle = (e) => {
		const { name } = e.target;
		setDisplayOptions({ ...displayOptions, [name]: !displayOptions[name] });
	};

	return (
		<div>
			<Typography
				className={classes.bottomSpacing}
				variant={isMobile ? 'h6' : 'h5'}
			>
				Home/Timeline
			</Typography>

			<FormControlLabel
				control={
					<Switch
						checked={displayOptions.showAddComment}
						onChange={handleDisplayToggle}
						name='showAddComment'
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
					/>
				}
				label='Always show last comment'
				labelPlacement='start'
			/>
		</div>
	);
};

export default DisplayOptions;
