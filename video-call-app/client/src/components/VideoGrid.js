import React from 'react';
import styled from 'styled-components';
import VideoPlayer from './VideoPlayer';

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
  height: calc(100vh - 100px);
  width: 100%;
  
  ${({ count }) => {
    if (count === 1) {
      return `grid-template-columns: 1fr;`;
    } else if (count === 2) {
      return `grid-template-columns: 1fr 1fr;`;
    } else if (count <= 4) {
      return `grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;`;
    } else {
      return `grid-template-columns: repeat(3, 1fr);
              grid-template-rows: 1fr 1fr;`;
    }
  }}
`;

function VideoGrid({ users, myStream, myUserId, myUserName, emojis }) {
  const totalCount = users.length + 1; // +1 for my video

  return (
    <Grid count={totalCount}>
      <VideoPlayer 
        stream={myStream} 
        userName={`${myUserName} (You)`} 
        muted={true}
        emoji={emojis[myUserId]}
      />
      
      {users.map(user => (
        <VideoPlayer 
          key={user.id}
          stream={user.stream} 
          userName={user.name}
          muted={false}
          emoji={emojis[user.id]}
        />
      ))}
    </Grid>
  );
}

export default VideoGrid;