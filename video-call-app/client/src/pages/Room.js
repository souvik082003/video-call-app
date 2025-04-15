import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import socket from '../utils/socket';
import VideoGrid from '../components/VideoGrid';
import Controls from '../components/Controls';

const RoomContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
`;

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [myStream, setMyStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [emojis, setEmojis] = useState({});
  
  // Get userName from location state or generate a guest name
  const userName = location.state?.userName || `Guest-${Math.floor(Math.random() * 1000)}`;
  const myUserId = useRef(uuidv4()).current;
  const peersRef = useRef({});

  useEffect(() => {
    // Get user media
    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    })
    .then(stream => {
      setMyStream(stream);
      
      // Join room once we have media
      socket.emit('join-room', {
        roomId,
        userId: myUserId,
        userName
      });
      
      // Handle existing users in the room
      socket.on('room-users', (roomUsers) => {
        const filteredUsers = roomUsers.filter(user => user.id !== myUserId);
        
        // Create peers for each existing user
        filteredUsers.forEach(user => {
          const peer = createPeer(user.id, myUserId, stream);
          peersRef.current[user.id] = {
            peerObj: peer,
            userId: user.id,
            name: user.name
          };
        });
      });
      
      // Handle new user connections
      socket.on('user-connected', ({ userId, userName }) => {
        console.log(`User connected: ${userName} (${userId})`);
      });
      
      // Handle incoming signals
      socket.on('user-signal', ({ from, signal }) => {
        // If it's a new peer we don't know about yet
        if (!peersRef.current[from]) {
          const peer = addPeer(signal, from, stream);
          peersRef.current[from] = {
            peerObj: peer,
            userId: from
          };
        } else {
          // Existing peer, just signal
          peersRef.current[from].peerObj.signal(signal);
        }
      });
      
      // Handle user disconnections
      socket.on('user-disconnected', (userId) => {
        console.log(`User disconnected: ${userId}`);
        if (peersRef.current[userId]) {
          peersRef.current[userId].peerObj.destroy();
          delete peersRef.current[userId];
          
          // Update users list
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        }
      });
      
      // Handle emojis
      socket.on('receive-emoji', ({ userId, emoji }) => {
        setEmojis(prev => ({
          ...prev,
          [userId]: emoji
        }));
        
        // Clear emoji after animation
        setTimeout(() => {
          setEmojis(prev => ({
            ...prev,
            [userId]: null
          }));
        }, 2000);
      });
      
      // Handle room full error
      socket.on('room-full', () => {
        alert('The room is full (max 5 people). Please try another room.');
        navigate('/');
      });
    })
    .catch(err => {
      console.error('Failed to get media permissions:', err);
      alert('Failed to access camera and microphone. Please check your permissions.');
      navigate('/');
    });
    
    // Clean up on component unmount
    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      socket.off('room-users');
      socket.off('user-connected');
      socket.off('user-signal');
      socket.off('user-disconnected');
      socket.off('receive-emoji');
      socket.off('room-full');
      
      // Destroy all peers
      Object.values(peersRef.current).forEach(peer => {
        if (peer.peerObj) {
          peer.peerObj.destroy();
        }
      });
    };
  }, [roomId, myUserId, userName, navigate]);
  
  // Update users list whenever peers change
  useEffect(() => {
    const currentUsers = Object.values(peersRef.current).map(peer => ({
      id: peer.userId,
      name: peer.name || 'Unknown',
      stream: peer.stream
    }));
    
    setUsers(currentUsers);
  }, [peersRef.current]);

  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socket.emit('send-signal', {
        userId: callerId,
        signal,
        to: userToSignal
      });
    });

    peer.on('stream', remoteStream => {
      // Add the remote stream to our user list
      setUsers(prevUsers => {
        const existingUser = prevUsers.find(user => user.id === userToSignal);
        if (existingUser) {
          return prevUsers.map(user => 
            user.id === userToSignal ? { ...user, stream: remoteStream } : user
          );
        } else {
          const userInfo = peersRef.current[userToSignal] || {};
          return [...prevUsers, {
            id: userToSignal,
            name: userInfo.name || 'User',
            stream: remoteStream
          }];
        }
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socket.emit('send-signal', {
        userId: myUserId,
        signal,
        to: callerId
      });
    });

    peer.on('stream', remoteStream => {
      // Add the remote stream to our user list
      setUsers(prevUsers => {
        const existingUser = prevUsers.find(user => user.id === callerId);
        if (existingUser) {
          return prevUsers.map(user => 
            user.id === callerId ? { ...user, stream: remoteStream } : user
          );
        } else {
          const userInfo = peersRef.current[callerId] || {};
          return [...prevUsers, {
            id: callerId,
            name: userInfo.name || 'User',
            stream: remoteStream
          }];
        }
      });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const leaveRoom = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };
  
  const sendEmoji = (emoji) => {
    // Show emoji for myself
    setEmojis(prev => ({
      ...prev,
      [myUserId]: emoji
    }));
    
    // Send to others
    socket.emit('send-emoji', {
      userId: myUserId,
      emoji
    });
    
    // Clear my emoji after animation
    setTimeout(() => {
      setEmojis(prev => ({
        ...prev,
        [myUserId]: null
      }));
    }, 2000);
  };

  return (
    <RoomContainer>
      <VideoGrid 
        users={users} 
        myStream={myStream}
        myUserId={myUserId}
        myUserName={userName}
        emojis={emojis}
      />
      <Controls 
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        leaveRoom={leaveRoom}
        isVideoOn={isVideoOn}
        isAudioOn={isAudioOn}
        sendEmoji={sendEmoji}
        roomId={roomId}
      />
    </RoomContainer>
  );
}

export default Room;