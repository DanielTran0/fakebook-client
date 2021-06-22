import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import setUserImageSource from '../util/setUserImageSource';
import { userDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	flex: { display: 'flex' },
	flexColumn: {
		display: 'flex',
		flexDirection: 'column',
	},
	avatar: {
		alignSelf: 'flex-end',
		height: 30,
		width: 30,
		marginRight: 20,
	},
	textBackground: {
		display: 'inline-block',
		padding: '0px 10px',
		background: '#545454',
		color: 'white',
	},
	username: {
		alignSelf: (props) => props.alignSelf,
	},
});

const Message = ({ userInfo, message, isCurrentUser }) => {
	const { firstName, lastName } = userInfo;
	const styleProps = { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' };
	const classes = useStyles(styleProps);

	return (
		<div className={classes.flex}>
			{!isCurrentUser && (
				<Avatar className={classes.avatar} src={setUserImageSource(userInfo)} />
			)}

			<div className={classes.flexColumn}>
				<Typography className={classes.username}>
					{isCurrentUser ? 'You' : `${firstName} ${lastName}`}
				</Typography>

				<div>
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
	isCurrentUser: PropTypes.bool.isRequired,
};

export default Message;
