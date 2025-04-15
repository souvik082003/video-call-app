import React, { useState } from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: #1a1a1a;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const ControlButton = styled.button`
  background-color: ${props => props.danger ? '#ff4d4d' : (props.active ? '#4fa6ff' : '#333')};
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.danger ? '#ff3333' : (props.active ? '#3d8bdb' : '#444')};
  }
`;

const EmojiContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 20px;
`;

const EmojiButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.2);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const RoomIdContainer = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #aaa;
`;

const RoomIdText = styled.span`
  font-size: 14px;
`;

const CopyButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #444;
  }
`;

function Controls({ 
  toggleVideo, 
  toggleAudio, 
  leaveRoom, 
  isVideoOn, 
  isAudioOn, 
  sendEmoji,
  roomId
}) {
  const [copied, setCopied] = useState(false);
  
  const emojiList = ['💖', '😄', '😍', '👍', '🎉'];
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ControlsContainer>
      <ButtonGroup>
        <ControlButton 
          active={isVideoOn} 
          onClick={toggleVideo}
        >
          {isVideoOn ? '📹' : '🚫'}
        </ControlButton>
        
        <ControlButton 
          active={isAudioOn} 
          onClick={toggleAudio}
        >
          {isAudioOn ? '🎤' : '🔇'}
        </ControlButton>
        
        <ControlButton 
          danger 
          onClick={leaveRoom}
        >
          📞
        </ControlButton>
      </ButtonGroup>
      
      <EmojiContainer>
        {emojiList.map(emoji => (
          <EmojiButton 
            key={emoji} 
            onClick={() => sendEmoji(emoji)}
          >
            {emoji}
          </EmojiButton>
        ))}
      </EmojiContainer>
      
      <RoomIdContainer>
        <RoomIdText>Room ID: {roomId}</RoomIdText>
        <CopyButton onClick={copyRoomId}>
          {copied ? 'Copied!' : 'Copy'}
        </CopyButton>
      </RoomIdContainer>
    </ControlsContainer>
  );
}

export default Controls;