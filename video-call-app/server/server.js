const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active rooms and their participants
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    console.log(`${userName} (${userId}) joining room: ${roomId}`);
    
    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = { users: {} };
    }
    
    // Check if room is full (5 people max)
    const roomUsers = Object.keys(rooms[roomId].users).length;
    if (roomUsers >= 5) {
      socket.emit('room-full');
      return;
    }
    
    // Add user to room
    socket.join(roomId);
    rooms[roomId].users[userId] = {
      id: userId,
      name: userName,
      socketId: socket.id
    };
    
    // Notify others in the room
    socket.to(roomId).emit('user-connected', {
      userId,
      userName
    });
    
    // Send existing users to the new participant
    socket.emit('room-users', Object.values(rooms[roomId].users));
    
    // Handle WebRTC signaling
    socket.on('send-signal', ({ userId, signal, to }) => {
      io.to(rooms[roomId].users[to]?.socketId).emit('user-signal', {
        from: userId,
        signal
      });
    });
    
    // Handle emoji reactions
    socket.on('send-emoji', ({ userId, emoji }) => {
      socket.to(roomId).emit('receive-emoji', {
        userId,
        emoji
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      if (rooms[roomId]) {
        // Remove user from room
        delete rooms[roomId].users[userId];
        
        // Notify others
        socket.to(roomId).emit('user-disconnected', userId);
        
        // Clean up empty rooms
        if (Object.keys(rooms[roomId].users).length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.send('Video Call Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});