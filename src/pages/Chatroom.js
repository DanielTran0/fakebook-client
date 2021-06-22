import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import Message from '../components/Message';

import socket from '../util/socket';
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
});

const Chatroom = ({ userData }) => {
	const { _id, firstName, lastName, profileImage } = userData.user;
	const [messages, setMessages] = useState([]);
	const [currentMessage, setCurrentMessage] = useState('');
	const messageEndRef = useRef(null);
	const classes = useStyles();

	useEffect(() => {
		socket.connect();

		socket.on('message', (message) => {
			setMessages((oldMessages) => [...oldMessages, message]);
			messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});

		// TODO remove
		// socket.onAny((event, ...args) => {
		// 	console.log(event, args);
		// });
		return () => {
			socket.disconnect();
		};
	}, []);

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
		};
		setCurrentMessage('');
		return socket.emit('send message', messageObject);
	};

	return (
		<Container maxWidth='sm'>
			<Typography variant='h4'>Chat</Typography>
			<Paper className={classes.mainDisplay}>
				<div className={classes.messageDisplay}>
					{messages.map((message) => {
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
									isCurrentUser={message.user._id === userData.user._id}
								/>
							</div>
						);
					})}
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
	);
};

Chatroom.propTypes = { userData: PropTypes.shape(userDataProp).isRequired };

export default Chatroom;
