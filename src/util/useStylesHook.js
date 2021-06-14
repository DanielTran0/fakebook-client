import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
	return {
		formField: {
			marginBottom: theme.spacing(2),
		},
		modal: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%)`,
		},
	};
});

export default useStyles;
