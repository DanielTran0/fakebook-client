import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core';

import Message from '../components/Message';

import socket from '../util/socket';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	loading: { display: 'flex', justifyContent: 'center' },
	bottomSpacing: {
		marginBottom: 10,
	},
	paperPadding: {
		padding: '15px 0',
	},
	capitalize: {
		textTransform: 'capitalize',
	},
	unbold: {
		fontWeight: 'normal',
	},
	userInfo: { display: 'flex', alignItems: 'center', marginTop: 10 },
	avatar: {
		width: (props) => props.avatarSize,
		height: (props) => props.avatarSize,
		marginRight: 15,
	},
	mainDisplay: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: (props) => props.displayHeight,
	},
	messageDisplay: {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		marginBottom: 20,
	},
	yourMessage: {
		alignSelf: 'flex-end',
		marginTop: 10,
	},
	userMessage: {
		marginTop: 10,
	},
});

const Chatroom = ({ userData, setActiveTab }) => {
	const { _id, firstName, lastName, profileImage } = userData.user;
	const [messages, setMessages] = useState([]);
	const [currentMessage, setCurrentMessage] = useState('');
	const [allUsers, setAllUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const messageEndRef = useRef(null);
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const styleProps = {
		avatarSize: isSmallScreen ? 40 : 45,
		displayHeight: isSmallScreen ? 350 : 550,
	};
	const classes = useStyles(styleProps);

	useEffect(() => {
		setActiveTab('chat');
		socket.connect();
		socket.emit('joinRoom', { _id, firstName, lastName, profileImage });
		socket.on('currentUsers', (users) => {
			setAllUsers(users);
		});
		socket.on('message', (message) => {
			setMessages((oldMessages) => [...oldMessages, message]);
			messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});
		setIsLoading(false);

		return () => {
			socket.disconnect();
			setMessages([]);
		};
	}, [_id, firstName, lastName, profileImage, setActiveTab]);

	const handleMessageChange = (e) => {
		const { value } = e.target;
		setCurrentMessage(value);
	};

	const handleMessageSubmit = (e) => {
		e.preventDefault();

		if (currentMessage === '') return null;

		const messageObject = {
			_id: uuid(),
			user: { _id, firstName, lastName, profileImage },
			text: currentMessage,
			date: Date.now(),
		};
		setCurrentMessage('');
		return socket.emit('send message', messageObject);
	};

	const messageComponents = messages.map((message) => (
		<div
			className={
				message.user._id === userData.user._id
					? classes.yourMessage
					: classes.userMessage
			}
			key={message._id}
		>
			<Message
				userInfo={message.user}
				message={message.text}
				date={message.date}
				isCurrentUser={message.user._id === userData.user._id}
			/>
		</div>
	));

	const userComponents = allUsers.map((user) => (
		<Link
			href={`#/user/${user._id}`}
			underline='none'
			color='textPrimary'
			className={classes.userInfo}
			key={user._id}
		>
			<Avatar className={classes.avatar} src={setUserImageSource(user)} />

			<Typography className={classes.capitalize}>
				{user.firstName} {user.firstName}
			</Typography>
		</Link>
	));

	return isLoading ? (
		<div className={classes.loading}>
			<CircularProgress />
		</div>
	) : (
		<div>
			<Typography
				variant={isSmallScreen ? 'h5' : 'h4'}
				align='center'
				className={classes.bottomSpacing}
			>
				Chat
			</Typography>

			<Grid container>
				<Grid item md={1} lg={2} xl={3} />

				<Grid
					item
					xs={12}
					md={4}
					lg={3}
					xl={2}
					className={classes.bottomSpacing}
				>
					<Container maxWidth='xs'>
						<Paper className={classes.paperPadding}>
							<Container>
								<Typography
									variant={isSmallScreen ? 'h6' : 'h5'}
									align='center'
									className={classes.unbold}
								>
									Active People
								</Typography>
								{userComponents}
							</Container>
						</Paper>
					</Container>
				</Grid>

				<Grid item xs={12} md={7} lg={5} xl={3}>
					<Container maxWidth='sm'>
						<Paper className={classes.mainDisplay}>
							<Container className={classes.messageDisplay}>
								{messageComponents}
								<div ref={messageEndRef} />
							</Container>

							<div>
								<form onSubmit={handleMessageSubmit}>
									<TextField
										variant='outlined'
										label='Enter Message'
										name='message'
										size='small'
										fullWidth
										value={currentMessage}
										onChange={handleMessageChange}
									/>
								</form>
							</div>
						</Paper>
					</Container>
				</Grid>
			</Grid>
		</div>
	);
};

Chatroom.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setActiveTab: PropTypes.func.isRequired,
};

export default Chatroom;
