import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';

// console.log(roomCode);
const Homepage = ({roomCode}) => {
  console.log(roomCode);
  // const roomCode = useSelector((state) => state.roomCode.value)
  
  return (
    <div className="min-h-screen bg-gray-600 flex justify-center items-center">
      <div className='bg-white rounded-lg shadow-md p-8 w-full md:w-1/2 lg:w-1/3'>
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to Music Room</h1>
        <p className="text-gray-500 text-center mb-6">Create or Join a Room to Enjoy Music Together</p>
        <div className="flex flex-col items-center">
          <Link to="/create" className="w-full p-2 mb-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300 ease-in-out">
            <span className='flex justify-center text-center items-center'>Create a Room</span>
          </Link>
          <Link to="/join" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out">
            <span className='flex justify-center text-center items-center'>Join a Room</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage
