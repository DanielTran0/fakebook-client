import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
	return {
		flex: {
			display: 'flex',
		},
		capitalize: {
			textTransform: 'capitalize',
		},
		bottomSpacing: {
			marginBottom: theme.spacing(2),
		},
		sideSpacing: {
			marginRight: theme.spacing(1),
		},
		buttonSpaceEnd: {
			display: 'flex',
			justifyContent: 'space-between',
			marginLeft: 10,
			marginRight: 10,
		},
		modal: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%)`,
		},
		postSpacing: {
			marginBottom: theme.spacing(4),
		},
		postButtons: {
			margin: 'auto',
		},
		commentOptions: {
			marginTop: -15,
			marginRight: -35,
		},
		commentText: {
			display: 'inline-block',
			padding: 8,
			borderRadius: 10,
			backgroundColor: '#ebebeb',
			marginTop: -5,
			marginLeft: -10,
			marginBottom: 5,
		},
		commentFooter: {
			display: 'flex',
			alignItems: 'center',
			marginLeft: -10,
		},
		commentLikesNumber: {
			display: 'flex',
			position: 'absolute',
			alignSelf: 'flex-end',
		},
		userCardPaper: {
			paddingTop: theme.spacing(1.5),
			paddingBottom: theme.spacing(1.5),
		},
		userCardSpacing: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		userCardInfo: {
			display: 'flex',
			alignItems: 'center',
			maxWidth: '65%',
		},
		friendIncoming: {
			display: 'flex',
			flexDirection: 'column',
		},
	};
});

export default useStyles;
