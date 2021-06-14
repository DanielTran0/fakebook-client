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
		postImage: {
			height: 100,
			width: 100,
		},
		postButtons: {
			margin: 'auto',
		},
		postInfo: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	};
});

export default useStyles;
