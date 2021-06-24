import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import Message from '../components/Message';

import socket from '../util/socket';
import setUserImageSource from '../util/setUserImageSource';
import { userDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	mainDisplay: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 400,
	},
	messageDisplay: {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		marginBottom: 20,
	},
	yourMessage: {
		alignSelf: 'flex-end',
		marginRight: 10,
	},
	userMessage: {
		marginLeft: 10,
	},
	userInfo: { display: 'flex', alignItems: 'center', marginBottom: 10 },
	userImage: {
		marginRight: 10,
	},
});

const Chatroom = ({ userData, setActiveTab }) => {
	const { _id, firstName, lastName, profileImage } = userData.user;
	const [messages, setMessages] = useState([]);
	const [currentMessage, setCurrentMessage] = useState('');
	const [allUsers, setAllUsers] = useState([]);
	const messageEndRef = useRef(null);
	const classes = useStyles();

	useEffect(() => {
		setActiveTab('chat');
		socket.connect();
		socket.emit('joinRoom', { firstName, lastName, profileImage });
		socket.on('currentUsers', (users) => {
			setAllUsers(users);
		});

		socket.on('message', (message) => {
			setMessages((oldMessages) => [...oldMessages, message]);
			messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});

		// TODO remove
		socket.onAny((event, ...args) => {
			console.log(event, args);
		});

		return () => {
			socket.disconnect();
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

	const displayMessages = () => {
		return messages.map((message) => {
			return (
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
			);
		});
	};

	const displayUsers = () => {
		return allUsers.map((user) => (
			<div className={classes.userInfo}>
				<Avatar className={classes.userImage} src={setUserImageSource(user)} />
				<Typography key={user.id}>
					{user.firstName} {user.firstName}
				</Typography>
			</div>
		));
	};

	return (
		<div>
			<Typography variant='h4' align='center'>
				Chat
			</Typography>

			<Grid container>
				<Grid item xs={12} sm={3}>
					<Container>
						<Typography variant='h6' align='center'>
							Current People
						</Typography>
						{displayUsers()}
					</Container>
				</Grid>
				<Grid item xs={12} sm={9} md={6}>
					<Container maxWidth='sm'>
						<Paper className={classes.mainDisplay}>
							<div className={classes.messageDisplay}>
								{displayMessages()}
								<div ref={messageEndRef} />
							</div>
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
				<Grid item xs={12} md={3} />
			</Grid>
		</div>
	);
};

Chatroom.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setActiveTab: PropTypes.func.isRequired,
};

export default Chatroom;
