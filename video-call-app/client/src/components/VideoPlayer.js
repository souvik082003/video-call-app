import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: #242424;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserName = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
`;

const EmojiReaction = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  opacity: 1;
  transition: opacity 0.5s ease, transform 0.5s ease;
  animation: float 2s ease-out forwards;
  
  @keyframes float {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0.2);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -200%) scale(1);
    }
  }
`;

function VideoPlayer({ stream, userName, muted, emoji }) {
  const videoRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('');

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (emoji) {
      setCurrentEmoji(emoji);
      setShowEmoji(true);
      
      const timer = setTimeout(() => {
        setShowEmoji(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [emoji]);

  return (
    <VideoContainer>
      <Video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted={muted} 
      />
      <UserName>{userName}</UserName>
      {showEmoji && <EmojiReaction>{currentEmoji}</EmojiReaction>}
    </VideoContainer>
  );
}

export default VideoPlayer;