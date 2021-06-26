import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import formatTime from '../util/formatTime';
import { userDataProp } from '../util/customPropTypes';

const useStyles = makeStyles((theme) => ({
	flex: { display: 'flex' },
	flexColumn: {
		display: 'flex',
		flexDirection: 'column',
	},
	avatar: {
		alignSelf: 'flex-end',
		height: 30,
		width: 30,
		marginRight: 10,
	},
	textBackground: {
		display: 'inline-block',
		padding: '7px 13px',
		borderRadius: 20,
		background: (props) => {
			if (props.isCurrentUser) return theme.palette.primary.main;
			if (theme.palette.type === 'dark') return '#333';
			return '#ddd';
		},
		color: (props) => {
			if (props.isCurrentUser) return 'white';
			if (theme.palette.type === 'dark') return 'white';
			return 'black';
		},
	},
	username: {
		alignSelf: (props) => props.alignSelf,
		textTransform: 'capitalize',
		marginBottom: 3,
	},
	currentUserMessage: {
		alignSelf: (props) => props.alignSelf,
	},
}));

const Message = ({ userInfo, message, date, isCurrentUser }) => {
	const { firstName, lastName } = userInfo;
	const styleProps = {
		alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
		isCurrentUser,
	};
	const classes = useStyles(styleProps);

	return (
		<div className={classes.flex}>
			{!isCurrentUser && (
				<Avatar className={classes.avatar} src={userInfo.profileImageUrl} />
			)}

			<div className={classes.flexColumn}>
				<Typography className={classes.username}>
					{isCurrentUser ? 'You · ' : `${firstName} ${lastName} · `}
					{formatTime(date)}
				</Typography>

				<div className={classes.currentUserMessage}>
					<Paper className={classes.textBackground}>
						<Typography>{message}</Typography>
					</Paper>
				</div>
			</div>
		</div>
	);
};

Message.propTypes = {
	userInfo: PropTypes.shape(userDataProp.user).isRequired,
	message: PropTypes.string.isRequired,
	date: PropTypes.number.isRequired,
	isCurrentUser: PropTypes.bool.isRequired,
};

export default Message;
