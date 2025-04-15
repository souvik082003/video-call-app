import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
  background-color: #121212;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #4fa6ff;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  gap: 15px;
  background-color: #1e1e1e;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 16px;
  background-color: #333;
  color: white;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4fa6ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3d8bdb;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  
  &:before, &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #444;
  }
  
  span {
    padding: 0 10px;
    color: #888;
  }
`;

function Home() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidv4();
    if (userName.trim()) {
      navigate(`/room/${newRoomId}`, { state: { userName } });
    } else {
      alert('Please enter your name');
    }
  };

  const joinRoom = () => {
    if (roomId.trim() && userName.trim()) {
      navigate(`/room/${roomId}`, { state: { userName } });
    } else {
      alert('Please enter both room ID and your name');
    }
  };

  return (
    <HomeContainer>
      <Title>Group Video Chat</Title>
      <Form>
        <Input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        
        <Button onClick={createRoom}>Create New Room</Button>
        
        <Divider><span>OR</span></Divider>
        
        <Input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={joinRoom}>Join Room</Button>
      </Form>
    </HomeContainer>
  );
}

export default Home;