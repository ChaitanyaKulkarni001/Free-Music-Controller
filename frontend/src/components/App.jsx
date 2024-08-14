import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import CreateRoomPage from './CreateRoomPage.jsx';
import RoomjoinPage from './RoomjoinPage.jsx';
import Room from './Room.jsx';
import '../index.css';
import { store } from '../redux/store.js';
import { Provider } from 'react-redux';
import UpdateRoom from './UpdateRoom.jsx';

const App = () => {
  const [roomCode, setRoomCode] = useState(null);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {roomCode ? (
            <Route path="/" element={<Navigate to={`/room/${roomCode}`} replace />} />
          ) : (
            <Route path="/" element={<Homepage roomCode={roomCode} />} />
          )}
          <Route path="/create" element={<CreateRoomPage update={false} code={0} />} />
          <Route path="/join" element={<RoomjoinPage />} />
          <Route path="/update" element={<UpdateRoom />} />
          <Route path="/room/:roomcode" element={<Room setRoom={setRoomCode} />} />
        </Routes>
        <FetchRoomCode setRoomCode={setRoomCode} />
      </BrowserRouter>
    </Provider>
  );
};

const FetchRoomCode = ({ setRoomCode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user-in-room");
        const data = await response.json();
        console.log(data);
        console.log('data.code:', data.code);
        if (data.code) {
          setRoomCode(data.code);
          navigate(`/room/${data.code}`);
        }
      } catch (error) {
        console.error('Error fetching room code:', error);
      }
    };

    fetchData();
  }, [navigate, setRoomCode]);

  return null;
};

export default App;

const appDiv = document.getElementById("app");
render(<App />, appDiv);
