import { io } from 'socket.io-client';

// TODO change url to backend
const URL = 'http://localhost:5000';
const socket = io(URL, { autoConnect: false });

export default socket;
