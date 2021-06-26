import { io } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(URL, { autoConnect: false });

export default socket;
