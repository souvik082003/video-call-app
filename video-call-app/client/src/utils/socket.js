import io from 'socket.io-client';

// Replace with your actual backend URL when deploying
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app-name.onrender.com' 
  : 'http://localhost:5000';

export const socket = io(SOCKET_URL);

export default socket;