import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RoomJoinPage = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  const roomButtonPressed =  () => {
    if (!roomCode) {
      setError('Room code cannot be empty.');
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: roomCode }),
    };

    // try {
      fetch('/api/join-room', requestOptions).then((res)=>{
        if (res.ok){
          navigate(`/room/${roomCode}`);
        }
        else{
          setError('Room not found.');
        }
      });
      // const text = await response.text(); // Read the response as text
  }
      // if (response.ok) {
      //   navigate(`/room/${roomCode}`);
      // } else {
      //   // Try to parse the response text as JSON
        // try {
          // const data = JSON.parse(text);
          // setError(data.error || 'Room not found.');
        //}// catch (jsonError) {
        //   console.error('JSON parse error:', jsonError);
        //   console.error('Response text:', text);
        //   setError('Room not found.');
        // }
      // }
    // } catch (networkError) {
    //   console.error('Network error:', networkError);
    //   setError('An unexpected error occurred.');
    // }
 // };

  return (
    <div className="min-h-screen bg-gray-600 flex justify-center items-center">
      <div className='bg-white rounded-lg shadow-md p-8 w-full md:w-1/2 lg:w-1/3'>
        <h1 className="text-3xl font-bold mb-4 text-center">Join a Room now!</h1>
        <div className="relative mb-4">
          <input
            className={`w-full p-2 border text-black ${error ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            type="text"
            value={roomCode}
            onChange={handleTextFieldChange}
            placeholder="Enter Room Code"
          />
          {error && <span className="text-red-400 text-sm absolute left-2 -bottom-4">{error}</span>}
        </div>
        <div className="flex justify-center">
          <button
            className="w-full p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
            onClick={roomButtonPressed}
          >
            Enter Room
          </button>
          <Link to="/" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-400">
            <span className='flex justify-center items-center mx-auto'>Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomJoinPage;
