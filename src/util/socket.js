import { io } from 'socket.io-client';

// TODO change url to backend
const URL = 'https://fakebook-api-daniel-tran.herokuapp.com/';
const socket = io(URL, { autoConnect: false });

export default socket;
